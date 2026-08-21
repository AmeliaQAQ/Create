function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/config') {
      return json({
        serverConfigured: !!env.OPENAI_API_KEY,
        baseUrl: (env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, ''),
        model: env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: Number(env.OPENAI_TEMPERATURE) || 0.8,
        maxTokens: Number(env.OPENAI_MAX_TOKENS) || 6000
      });
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function handleChat(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch (err) {
    return json({ error: { message: '请求体无效' } }, 400);
  }

  const baseUrl = (payload.baseUrl || env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const url = /\/chat\/completions$/.test(baseUrl) ? baseUrl : baseUrl + '/chat/completions';
  const apiKey = payload.apiKey || env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ error: { message: '未配置 API Key' } }, 400);
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: payload.model || env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: payload.messages || [],
        temperature: payload.temperature ?? (Number(env.OPENAI_TEMPERATURE) || 0.8),
        max_tokens: payload.max_tokens ?? (Number(env.OPENAI_MAX_TOKENS) || 6000)
      })
    });

    let data;
    try {
      data = await upstream.json();
    } catch (err) {
      return json({ error: { message: '上游响应解析失败' } }, 502);
    }
    return json(data, upstream.status);
  } catch (err) {
    return json({ error: { message: err.message || '服务器错误' } }, 502);
  }
}
