type PagesFunction<Env = Record<string, string>> = (context: {
  request: Request;
  env: Env;
}) => Response | Promise<Response>;

interface Env {
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;
  ALLOWED_ORIGIN?: string;
}

interface AiRequestBody {
  prompt?: string;
  systemInstruction?: string;
  responseJson?: boolean;
}

const DEFAULT_MODEL = 'llama-3.1-8b-instant';

function corsHeaders(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get('Origin') ?? '*';
  const allowedOrigins = env.ALLOWED_ORIGIN?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const allowOrigin =
    allowedOrigins && allowedOrigins.length > 0
      ? allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0]
      : '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function jsonResponse(request: Request, env: Env, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request, env),
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = ({ request, env }) =>
  new Response(null, {
    status: 204,
    headers: corsHeaders(request, env),
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.GROQ_API_KEY) {
    return jsonResponse(request, env, { error: 'Missing GROQ_API_KEY secret.' }, 401);
  }

  let body: AiRequestBody;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, env, { error: 'Request body must be JSON.' }, 400);
  }

  if (!body.prompt || typeof body.prompt !== 'string') {
    return jsonResponse(request, env, { error: 'Missing prompt.' }, 400);
  }

  const systemInstruction = [
    body.systemInstruction,
    body.responseJson
      ? 'Return only valid JSON. Do not include markdown fences or explanatory text.'
      : undefined,
  ]
    .filter(Boolean)
    .join('\n\n');

  const model = env.GROQ_MODEL || DEFAULT_MODEL;
  const messages = [
    ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
    { role: 'user', content: body.prompt },
  ];

  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: body.responseJson ? 0.1 : 0.25,
      max_tokens: body.responseJson ? 2048 : 900,
    }),
  });

  const data = await groqResponse.json().catch(() => null);
  if (!groqResponse.ok) {
    const message =
      data?.error?.message ?? `Groq returned HTTP ${groqResponse.status}.`;
    return jsonResponse(request, env, { error: message }, groqResponse.status);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== 'string') {
    return jsonResponse(request, env, { error: 'Groq returned an empty response.' }, 502);
  }

  return jsonResponse(request, env, {
    text,
    provider: 'Groq',
    model,
  });
};

export const onRequestGet: PagesFunction<Env> = ({ request, env }) =>
  jsonResponse(request, env, { error: 'Use POST /api/ai.' }, 405);
