export const SITE_NAME = 'SoftScan AI';

export const socialLinks = {
  github: 'https://github.com/',
  twitter: 'https://x.com/',
  email: 'mailto:support@softscan.app?subject=SoftScan%20AI',
} as const;

export type FooterLink = { label: string; path: string };

export const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', path: '/features' },
      { label: 'Dashboard Demo', path: '/demo' },
      { label: 'How It Works', path: '/how-it-works' },
      { label: 'Export Tools', path: '/export' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', path: '/docs' },
      { label: 'API Reference', path: '/api' },
      { label: 'Changelog', path: '/changelog' },
      { label: 'Status', path: '/status' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Blog', path: '/blog' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ],
  },
];

export interface PageSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface SitePage {
  title: string;
  subtitle: string;
  sections: PageSection[];
  cta?: { label: string; path: string };
}

export const sitePages: Record<string, SitePage> = {
  features: {
    title: 'Features',
    subtitle: 'What SoftScan AI does today on your machine.',
    cta: { label: 'Open dashboard', path: '/#demo' },
    sections: [
      {
        title: 'Software audit',
        paragraphs: [
          'Upload a winget export and get a prioritized list of apps with version gaps, update suggestions, and security flags.',
        ],
      },
      {
        title: 'AI copilot',
        paragraphs: [
          'Ask follow-up questions in plain English. Answers stay focused on updates, CVE-style risks, and remediation steps.',
        ],
      },
      {
        title: 'Update scripts',
        paragraphs: [
          'Copy single winget commands or download PowerShell scripts for one app or a batch of outdated tools.',
        ],
        bullets: ['Per-app .ps1 downloads', 'Batch updater script', 'Scan history saved in your browser'],
      },
    ],
  },
  demo: {
    title: 'Dashboard demo',
    subtitle: 'The live dashboard appears after you upload a software list.',
    cta: { label: 'Start a scan', path: '/#chat-section' },
    sections: [
      {
        title: 'At a glance',
        paragraphs: [
          'The dashboard groups apps by status: security patches, general updates, and up to date. Paginate large lists and restore past scans from history.',
        ],
      },
      {
        title: 'Try it',
        paragraphs: [
          'Export installed apps with winget, upload the file in the copilot, and the dashboard fills automatically.',
        ],
        bullets: ['Supports .txt and .json exports', 'Up to 20 scans stored locally', 'No account required'],
      },
    ],
  },
  'how-it-works': {
    title: 'How it works',
    subtitle: 'Three steps from export to action.',
    cta: { label: 'Get export commands', path: '/export' },
    sections: [
      {
        title: '1. Export',
        paragraphs: ['Run a winget command in PowerShell to save your installed software list.'],
      },
      {
        title: '2. Upload',
        paragraphs: ['Drop the file into SoftScan Copilot. Gemini analyzes it; a local knowledge base is used if the API is unavailable.'],
      },
      {
        title: '3. Act',
        paragraphs: [
          'Review the dashboard, copy winget commands, or download scripts. Chat for clarification on specific apps.',
        ],
      },
    ],
  },
  export: {
    title: 'Export tools',
    subtitle: 'Commands to generate a file SoftScan can read.',
    cta: { label: 'Go to export section', path: '/#export' },
    sections: [
      {
        title: 'Recommended (JSON)',
        paragraphs: ['Structured output works best for parsing version strings.'],
        bullets: ['winget list | ConvertTo-Json | Out-File installed_apps.json'],
      },
      {
        title: 'Plain text',
        paragraphs: ['Simple list format; still supported for upload.'],
        bullets: ['winget list | Out-File installed_apps.txt'],
      },
    ],
  },
  docs: {
    title: 'Documentation',
    subtitle: 'Quick start for Windows users.',
    cta: { label: 'Run your first scan', path: '/#chat-section' },
    sections: [
      {
        title: 'Requirements',
        paragraphs: ['Windows 10/11, winget, PowerShell, and a modern browser. Optional: VITE_GEMINI_API_KEY in .env for full AI analysis.'],
      },
      {
        title: 'Environment',
        paragraphs: [
          'Create a .env file in the project root with your Gemini key. Restart the dev server after changes.',
        ],
        bullets: ['VITE_GEMINI_API_KEY=your_key_here'],
      },
      {
        title: 'Scripts',
        paragraphs: ['npm run dev — local development', 'npm run build — production bundle', 'npm run typecheck — TypeScript check'],
      },
    ],
  },
  api: {
    title: 'API reference',
    subtitle: 'Client-side modules used by the app (not a public HTTP API).',
    sections: [
      {
        title: 'aiService.ts',
        paragraphs: ['Core AI integration and fallbacks.'],
        bullets: [
          'getDetailedAnalysis(context) — returns AppHealth[] from file text',
          'processAiMessage(query, context?) — conversational replies',
          'Falls back to KNOWLEDGE_BASE when Gemini errors',
        ],
      },
      {
        title: 'scanHistory.ts',
        paragraphs: ['Persists ScanRecord objects under localStorage key softscan-scan-history (max 20 entries).'],
      },
      {
        title: 'updateScripts.ts',
        paragraphs: ['buildSingleAppPs1(app), buildBatchPs1(apps), downloadTextFile(filename, content)'],
      },
    ],
  },
  changelog: {
    title: 'Changelog',
    subtitle: 'Release notes for this project.',
    sections: [
      {
        title: 'Unreleased',
        paragraphs: ['Footer pages and routing, scan history, per-app update scripts.'],
      },
      {
        title: '0.1.0',
        paragraphs: ['Initial SoftScan AI landing: Gemini audit, dashboard, copilot chat, batch PowerShell export.'],
      },
    ],
  },
  about: {
    title: 'About',
    subtitle: 'Software health checks without enterprise complexity.',
    sections: [
      {
        title: 'Mission',
        paragraphs: [
          'SoftScan AI helps individuals keep Windows software current and understand update risk before running installers blindly.',
        ],
      },
      {
        title: 'Privacy stance',
        paragraphs: [
          'Scans are processed in your browser session. History is stored locally unless you later connect a cloud backend.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Privacy policy',
    subtitle: 'Last updated: May 2026',
    sections: [
      {
        title: 'Data you provide',
        paragraphs: [
          'Uploaded software lists and chat messages may be sent to Google Gemini when an API key is configured. Do not upload secrets or personal files unrelated to software inventory.',
        ],
      },
      {
        title: 'Local storage',
        paragraphs: ['Scan history and preferences are stored in your browser localStorage on this device.'],
      },
      {
        title: 'Third parties',
        paragraphs: ['Gemini API (Google) processes prompts when enabled. winget commands run locally on your machine.'],
      },
    ],
  },
  terms: {
    title: 'Terms of service',
    subtitle: 'Last updated: May 2026',
    sections: [
      {
        title: 'Use at your own risk',
        paragraphs: [
          'Update commands and scripts are suggestions. Review scripts before running as Administrator. SoftScan AI is not liable for system changes caused by winget or PowerShell.',
        ],
      },
      {
        title: 'No warranty',
        paragraphs: [
          'Version and security information may be incomplete or outdated. Verify critical patches through vendor channels.',
        ],
      },
      {
        title: 'Acceptable use',
        paragraphs: ['Do not abuse API keys, automate excessive requests, or use the tool for unlawful purposes.'],
      },
    ],
  },
};

export const blogPosts = [
  {
    id: 'why-winget-exports',
    date: '2026-05-10',
    title: 'Why winget exports beat manual inventories',
    excerpt: 'A consistent machine-readable list makes AI audits reliable.',
  },
  {
    id: 'batch-updates-safely',
    date: '2026-04-22',
    title: 'Running batch updates safely on Windows',
    excerpt: 'Run scripts elevated, one app at a time, and keep a restore point.',
  },
];
