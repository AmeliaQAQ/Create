function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestGet(context) {
  const env = context.env || {};
  return json({
    serverConfigured: !!env.OPENAI_API_KEY,
    baseUrl: (env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, ''),
    model: env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: Number(env.OPENAI_TEMPERATURE) || 0.8,
    maxTokens: Number(env.OPENAI_MAX_TOKENS) || 6000
  });
}
