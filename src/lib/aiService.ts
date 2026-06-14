// This service communicates with the Google Gemini API to analyze software lists and chat with users.
// It includes a robust fallback to a local mock knowledge base if the API key is invalid or rate-limited.

export interface AppHealth {
  name: string;
  status: 'ok' | 'update' | 'security';
  latestVersion: string;
  description: string;
  category: string;
  icon: string;
  foundVersion?: string;
  updateCommand?: string;
}

// Local Knowledge Base fallback for offline/fallback mode
const KNOWLEDGE_BASE: Record<string, AppHealth> = {
  chrome: {
    name: 'Google Chrome',
    status: 'security',
    latestVersion: '122.0.6261',
    category: 'Browser',
    icon: '🌐',
    description: 'A critical Zero-day vulnerability was patched in the latest version.',
    updateCommand: 'winget upgrade --id Google.Chrome'
  },
  vscode: {
    name: 'Visual Studio Code',
    status: 'update',
    latestVersion: '1.87.2',
    category: 'Editor',
    icon: '⚡',
    description: 'New feature: Profiles and updated terminal rendering.',
    updateCommand: 'winget upgrade --id Microsoft.VisualStudioCode'
  },
  mysql: {
    name: 'MySQL Workbench',
    status: 'ok',
    latestVersion: '8.0.36',
    category: 'Database',
    icon: '🗄',
    description: 'You are running the most stable version.',
    updateCommand: 'winget upgrade --id Oracle.MySQLWorkbench'
  },
  node: {
    name: 'Node.js',
    status: 'update',
    latestVersion: '20.11.0',
    category: 'Runtime',
    icon: '🟢',
    description: 'LTS version 20 is now recommended for better performance.',
    updateCommand: 'winget upgrade --id OpenJS.NodeJS.LTS'
  },
  slack: {
    name: 'Slack',
    status: 'update',
    latestVersion: '4.36.140',
    category: 'Communication',
    icon: '💬',
    description: 'Includes bug fixes for huddles and notification improvements.',
    updateCommand: 'winget upgrade --id SlackTechnologies.Slack'
  },
  docker: {
    name: 'Docker Desktop',
    status: 'update',
    latestVersion: '4.27.2',
    category: 'DevOps',
    icon: '🐳',
    description: 'New resource saver mode and performance improvements.',
    updateCommand: 'winget upgrade --id Docker.DockerDesktop'
  },
  postman: {
    name: 'Postman',
    status: 'security',
    latestVersion: '10.22.0',
    category: 'API Tools',
    icon: '🚀',
    description: 'Security patch for local proxy settings.',
    updateCommand: 'winget upgrade --id Postman.Postman'
  },
  git: {
    name: 'Git',
    status: 'ok',
    latestVersion: '2.43.0',
    category: 'Version Control',
    icon: '🌳',
    description: 'You are using the latest stable release.',
    updateCommand: 'winget upgrade --id Git.Git'
  },
  figma: {
    name: 'Figma',
    status: 'update',
    latestVersion: '116.15.4',
    category: 'Design',
    icon: '🎨',
    description: 'New prototyping features and UI updates.',
    updateCommand: 'winget upgrade --id Figma.Figma'
  },
  mongodb: {
    name: 'MongoDB Compass',
    status: 'update',
    latestVersion: '1.42.1',
    category: 'Database',
    icon: '🍃',
    description: 'Improved query performance and UI tweaks.',
    updateCommand: 'winget upgrade --id MongoDB.Compass.Community'
  },
  discord: {
    name: 'Discord',
    status: 'update',
    latestVersion: '1.0.9030',
    category: 'Communication',
    icon: '🎧',
    description: 'New voice chat filters and noise suppression updates.',
    updateCommand: 'winget upgrade --id Discord.Discord'
  },
  spotify: {
    name: 'Spotify',
    status: 'ok',
    latestVersion: '1.2.32.635',
    category: 'Media',
    icon: '🎵',
    description: 'Latest version includes the new desktop UI layout.',
    updateCommand: 'winget upgrade --id Spotify.Spotify'
  },
  steam: {
    name: 'Steam',
    status: 'update',
    latestVersion: '2.1.0',
    category: 'Gaming',
    icon: '🎮',
    description: 'Big Picture mode stability improvements.',
    updateCommand: 'winget upgrade --id Valve.Steam'
  },
  python: {
    name: 'Python',
    status: 'security',
    latestVersion: '3.12.2',
    category: 'Runtime',
    icon: '🐍',
    description: 'Security patch for SSL module and path handling.',
    updateCommand: 'winget upgrade --id Python.Python.3.12'
  },
  java: {
    name: 'Java JDK',
    status: 'update',
    latestVersion: '21.0.2',
    category: 'Runtime',
    icon: '☕',
    description: 'Performance updates and new garbage collector tweaks.',
    updateCommand: 'winget upgrade --id Oracle.JDK.21'
  },
  photoshop: {
    name: 'Adobe Photoshop',
    status: 'update',
    latestVersion: '25.5.0',
    category: 'Design',
    icon: '📸',
    description: 'Generative Fill AI improvements and bug fixes.',
    updateCommand: 'winget upgrade --id Adobe.Photoshop'
  },
  telegram: {
    name: 'Telegram Desktop',
    status: 'ok',
    latestVersion: '4.15.2',
    category: 'Communication',
    icon: '✈️',
    description: 'You are using the latest version with one-time voice messages.',
    updateCommand: 'winget upgrade --id Telegram.TelegramDesktop'
  },
  obs: {
    name: 'OBS Studio',
    status: 'update',
    latestVersion: '30.0.2',
    category: 'Video',
    icon: '📹',
    description: 'Enhanced support for AV1 encoding and HDR.',
    updateCommand: 'winget upgrade --id OBSProject.OBSStudio'
  }
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim() ?? '';
const AI_PROXY_URL =
  import.meta.env.VITE_AI_PROXY_URL?.trim() || (import.meta.env.PROD ? '/api/ai' : '');

/** Models tried in order (2.5-flash often returns 403 on free keys). */
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite'] as const;

export type AiConnectionState = 'connected' | 'fallback' | 'no_key';

export interface AiConnectionInfo {
  state: AiConnectionState;
  label: string;
  detail: string;
  lastModel?: string;
}

let connectionInfo: AiConnectionInfo = {
  state: AI_PROXY_URL || GEMINI_API_KEY ? 'fallback' : 'no_key',
  label: AI_PROXY_URL || GEMINI_API_KEY ? 'Offline mode' : 'No AI provider',
  detail: AI_PROXY_URL
    ? 'AI proxy not connected yet.'
    : GEMINI_API_KEY
      ? 'Gemini not connected yet.'
      : 'Configure VITE_AI_PROXY_URL for hosted AI or VITE_GEMINI_API_KEY for local Gemini testing.',
};

export function getAiConnectionInfo(): AiConnectionInfo {
  return connectionInfo;
}

class GeminiApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly apiMessage?: string
  ) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

class AiProxyError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly apiMessage?: string
  ) {
    super(message);
    this.name = 'AiProxyError';
  }
}

function setConnection(info: AiConnectionInfo) {
  connectionInfo = info;
}

function parseApiErrorMessage(errorText: string): string | undefined {
  try {
    const parsed = JSON.parse(errorText) as { error?: { message?: string } };
    return parsed.error?.message;
  } catch {
    return errorText.slice(0, 200) || undefined;
  }
}

function fallbackUserMessage(error: unknown): string {
  if (!AI_PROXY_URL && !GEMINI_API_KEY) {
    return '**Offline mode** — No AI provider is configured. For hosting, deploy the Cloudflare `/api/ai` function with `GROQ_API_KEY`; for local Gemini testing, set `VITE_GEMINI_API_KEY`.';
  }
  if (error instanceof AiProxyError) {
    if (error.status === 401) {
      return '**AI proxy is missing its secret key.** Add `GROQ_API_KEY` in Cloudflare Pages environment variables, then redeploy.';
    }
    if (error.status === 429) {
      return '**AI provider quota exceeded (429).** The hosted provider rate limit was reached. Try again later or switch models/providers.';
    }
    return `**AI proxy error (${error.status}).** ${error.apiMessage ?? 'Check Cloudflare Pages Function logs.'}`;
  }
  if (error instanceof GeminiApiError) {
    if (error.status === 429) {
      return '**Gemini quota exceeded (429).** Wait a few minutes or check usage at [Google AI Studio](https://aistudio.google.com/apikey). Then refresh and try again.';
    }
    if (error.status === 403) {
      return '**API key rejected (403).** Create a new key at [Google AI Studio](https://aistudio.google.com/apikey), update `.env`, and restart the dev server.';
    }
    if (error.status === 400) {
      return `**Invalid request (400).** ${error.apiMessage ?? 'Check your API key and model access.'}`;
    }
    return `**Gemini error (${error.status}).** ${error.apiMessage ?? 'See the browser console for details.'}`;
  }
  return '**Could not reach Gemini.** Check your internet connection and API key, then try again.';
}

interface GeminiRequestBody {
  contents: { parts: { text: string }[] }[];
  generationConfig: { responseMimeType?: string };
  systemInstruction?: { parts: { text: string }[] };
}

interface AiProxyResponse {
  text?: string;
  provider?: string;
  model?: string;
  error?: string;
}

async function callAiProxy(
  prompt: string,
  systemInstruction?: string,
  responseJson = false
): Promise<string> {
  if (!AI_PROXY_URL) {
    throw new AiProxyError('Missing AI proxy URL', 404);
  }

  const response = await fetch(AI_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemInstruction, responseJson }),
  });
  const data = (await response.json().catch(() => ({}))) as AiProxyResponse;

  if (!response.ok || !data.text) {
    throw new AiProxyError(
      `AI proxy returned status ${response.status}`,
      response.status,
      data.error
    );
  }

  const provider = data.provider ?? 'AI proxy';
  const model = data.model ? ` (${data.model})` : '';
  setConnection({
    state: 'connected',
    label: `${provider} connected`,
    detail: `Using ${provider}${model}.`,
    lastModel: data.model,
  });
  return data.text.trim();
}

async function requestGeminiModel(
  model: string,
  prompt: string,
  systemInstruction?: string,
  responseJson = false
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const body: GeminiRequestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {},
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }
  if (responseJson) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Gemini API Error (${model}):`, errorText);
    throw new GeminiApiError(
      `Gemini API returned status ${response.status}`,
      response.status,
      parseApiErrorMessage(errorText)
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiApiError('Empty response from Gemini API', 502);
  }
  return text.trim();
}

/**
 * Calls Gemini with model fallback and one retry on rate limits.
 */
async function callGemini(
  prompt: string,
  systemInstruction?: string,
  responseJson = false
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new GeminiApiError('Missing VITE_GEMINI_API_KEY', 401);
  }

  let lastError: unknown;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const text = await requestGeminiModel(model, prompt, systemInstruction, responseJson);
        setConnection({
          state: 'connected',
          label: 'Gemini connected',
          detail: `Using model ${model}.`,
          lastModel: model,
        });
        return text;
      } catch (error) {
        lastError = error;
        const isRateLimit = error instanceof GeminiApiError && error.status === 429;
        if (isRateLimit && attempt === 0) {
          await new Promise((r) => setTimeout(r, 2500));
          continue;
        }
        break;
      }
    }
  }

  const detail =
    lastError instanceof GeminiApiError
      ? `Last error: HTTP ${lastError.status}${lastError.apiMessage ? ` — ${lastError.apiMessage}` : ''}`
      : 'Could not connect to Gemini.';

  setConnection({
    state: 'fallback',
    label: 'Offline mode',
    detail,
  });

  throw lastError;
}

async function callAi(
  prompt: string,
  systemInstruction?: string,
  responseJson = false
): Promise<string> {
  if (AI_PROXY_URL) {
    return callAiProxy(prompt, systemInstruction, responseJson);
  }
  return callGemini(prompt, systemInstruction, responseJson);
}

/** Ping the configured AI provider for the status page. */
export async function testAiConnection(): Promise<AiConnectionInfo> {
  if (!AI_PROXY_URL && !GEMINI_API_KEY) {
    setConnection({
      state: 'no_key',
      label: 'No AI provider',
      detail: 'Deploy /api/ai with GROQ_API_KEY or set VITE_GEMINI_API_KEY for local testing.',
    });
    return connectionInfo;
  }
  try {
    await callAi('Reply with exactly: OK', undefined, false);
    return connectionInfo;
  } catch {
    return connectionInfo;
  }
}

export const testGeminiConnection = testAiConnection;

/**
 * Extracts and maps software information from a given text file using Gemini structured JSON.
 * Falls back to local regex-based parsing if the API fails or is unavailable.
 */
export async function getDetailedAnalysis(context: string): Promise<AppHealth[]> {
  try {
    const prompt = `
Analyze the following text file, which contains a list of installed software, packages, or versions on a user's machine.
Your goal is to extract a clean, curated list of MAJOR user-facing applications, programming runtimes, developer tools, databases, design tools, and web browsers.
- IGNORE minor utility libraries, sub-packages, npm dependencies, or build tools unless they have a known CRITICAL security vulnerability.
- LIMIT the total output to a MAXIMUM of the top 9 most important and relevant applications found in the file, prioritizing those with 'security' alerts or 'update' warnings first.

For EACH application found:
1. Extract the clean, friendly name of the software (e.g. "Google Chrome", "Python", "Node.js", "Docker Desktop").
2. Extract the installed/found version (e.g. "121.0.3", "3.10.4"). If no version is found, set it to "unknown".
3. Provide the latest available stable public version of this software as of mid-2026.
4. Determine the status:
   - "security": if there are known critical vulnerabilities in the installed version that are fixed in the latest version.
   - "update": if there is a newer stable version available, but no known critical security vulnerability.
   - "ok": if the installed version is the latest stable version or extremely close to it.
5. Provide a single emoji that represents the application as its "icon" (e.g., "🌐" for Chrome, "🐍" for Python, "🐳" for Docker, "⚡" for VS Code).
6. Provide a concise category (e.g. "Browser", "Runtime", "DevOps", "Database", "Editor", "Version Control", "Design", "Communication", etc.).
7. Provide a short, premium description (under 120 characters) explaining the status (e.g. "Security patch fixes critical memory corruption" or "New features and performance improvements").
8. Provide the exact winget upgrade command to update this application on Windows in the 'updateCommand' field (e.g., 'winget upgrade --id OpenJS.NodeJS.LTS' or 'winget upgrade --id Python.Python.3.12').

You must return a valid JSON array of objects. Do not include any markdown wrapper or explanation outside the JSON. The JSON schema must strictly be an array of:
{
  "name": string,
  "foundVersion": string,
  "latestVersion": string,
  "status": "ok" | "update" | "security",
  "icon": string,
  "category": string,
  "description": string,
  "updateCommand": string
}

Here is the file content to analyze:
---
${context}
---
`;

    const responseText = await callAi(prompt, "You are a professional software package auditing API that strictly outputs structured JSON arrays.", true);
    
    // Parse the JSON array
    const apps: AppHealth[] = JSON.parse(responseText);
    if (Array.isArray(apps)) {
      return apps;
    }
    throw new Error("Gemini response is not a valid JSON array");
  } catch (error) {
    console.warn("Gemini Audit failed, falling back to local simulation database:", error);
    
    // FALLBACK: Parse using local database regex match
    const lines = context.split('\n');
    const matchedApps: AppHealth[] = [];

    Object.keys(KNOWLEDGE_BASE).forEach(appKey => {
      const app = KNOWLEDGE_BASE[appKey];
      const appLine = lines.find(l => l.toLowerCase().includes(appKey));
      if (appLine) {
        const versionMatch = appLine.match(/(\d+\.\d+\.\d+)/);
        matchedApps.push({
          ...app,
          foundVersion: versionMatch ? versionMatch[0] : 'unknown'
        });
      }
    });
    return matchedApps;
  }
}

/**
 * Handles conversational inquiries by executing a system-guided call to the Gemini API.
 * Injects scanned context if available, enabling context-aware question answering.
 */
export async function processAiMessage(query: string, context?: string): Promise<string> {
  try {
    const systemInstruction = `
You are SoftScan AI, a specialized software health, version updates, and vulnerability assistant.
Your main responsibilities are:
1. Helping users check their installed software versions against the latest stable updates.
2. Explaining security vulnerabilities (CVEs) and bugs in older versions.
3. Guiding users on how to update their software, libraries, and tools step-by-step (e.g., using winget, brew, apt, npm, or official installers).
4. Only responding to queries directly related to software versions, updates, security patches, system health, and software installation.

IMPORTANT AUDIT & RESPONSE RULES:
- When presenting a file audit or scan result, keep it EXTREMELY CONCISE, short, and highly scannable. 
- Summarize the audit in a single high-level sentence (e.g., 'Audited X major tools: Y security warnings, Z updates').
- Do NOT create a long, repetitive list in the chat for every single application.
- Detailed sections should ONLY be shown for applications that have 'security' alerts or 'update' recommendations.
- For applications that are already 'ok' (up-to-date), simply list their names in a single sentence (e.g., 'Google Chrome and Slack are already up-to-date.') rather than giving them individual sections or descriptions.
- Keep your total response under 200 words. Keep paragraphs short and bullet points brief.
- If the user's query is not related to software, development tools, packages, system updates, or security vulnerabilities, you must politely decline and remind them that you are focused on software health and updates.
`;

    let prompt = "";
    if (context) {
      prompt += `The user has uploaded a file representing their system's installed software list. Here is the raw file content they uploaded:\n---\n${context}\n---\n\n`;
    }
    
    prompt += `User's message: "${query}"`;

    return await callAi(prompt, systemInstruction, false);
  } catch (error) {
    console.warn("Gemini Chat failed, falling back to local response logic:", error);
    const notice = fallbackUserMessage(error);

    // FALLBACK: Local simulated AI responses
    await new Promise(resolve => setTimeout(resolve, 800));
    const lowerQuery = query.toLowerCase();
    
    if (context) {
      const lines = context.split('\n');
      const matchedApps: { name: string; foundVersion: string; target: AppHealth }[] = [];

      Object.keys(KNOWLEDGE_BASE).forEach(appKey => {
        const app = KNOWLEDGE_BASE[appKey];
        const appLine = lines.find(l => l.toLowerCase().includes(appKey));
        if (appLine) {
          const versionMatch = appLine.match(/(\d+\.\d+\.\d+)/);
          matchedApps.push({
            name: app.name,
            foundVersion: versionMatch ? versionMatch[0] : 'unknown',
            target: app
          });
        }
      });

      if (matchedApps.length > 0 && (lowerQuery.includes('what') || lowerQuery.includes('update') || lowerQuery.includes('health') || lowerQuery.includes('analyze') || lowerQuery.includes('report'))) {
        let response = `I've analyzed your file (fallback mode) and found **${matchedApps.length}** relevant applications:\n\n`;
        
        matchedApps.forEach(item => {
          const needsUpdate = item.foundVersion !== 'unknown' && item.foundVersion !== item.target.latestVersion;
          const statusIcon = item.target.status === 'security' ? '🚨' : item.target.status === 'update' ? '⚠️' : '✅';
          
          response += `• **${item.name}**\n`;
          response += `  Current: v${item.foundVersion} ${needsUpdate ? `→ **Target: v${item.target.latestVersion}**` : '(Up to date)'}\n`;
          response += `  Status: ${statusIcon} ${item.target.description}\n\n`;
        });

        return `${notice}\n\n${response}`;
      }
    }

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return `${notice}\n\nHello! I'm your SoftScan AI. Upload a winget export or ask about a specific app (e.g. "How is Chrome?").`;
    }

    if (lowerQuery.includes('scan') || lowerQuery.includes('check')) {
      return `${notice}\n\nTo scan, upload a \`.txt\` or \`.json\` export from the paperclip button, or ask about an app by name.`;
    }

    const mentionedApp = Object.keys(KNOWLEDGE_BASE).find(app => lowerQuery.includes(app));
    if (mentionedApp) {
      const app = KNOWLEDGE_BASE[mentionedApp];
      return `${notice}\n\n**${app.name}** (offline data)\nStatus: ${app.status.toUpperCase()}\nLatest: v${app.latestVersion}\n\n${app.description}`;
    }

    return `${notice}\n\nI can still answer basic questions about known apps in offline mode. Fix the Gemini connection above for full AI analysis.`;
  }
}
