module.exports = async function chatHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method Not Allowed' } });
    return;
  }
  const payload = req.body || {};
  const baseUrl = (payload.baseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const url = /\/chat\/completions$/.test(baseUrl) ? baseUrl : baseUrl + '/chat/completions';
  const apiKey = payload.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(400).json({ error: { message: '未配置 API Key' } });
    return;
  }
  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: payload.model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: payload.messages || [],
        temperature: payload.temperature ?? (Number(process.env.OPENAI_TEMPERATURE) || 0.8),
        max_tokens: payload.max_tokens ?? (Number(process.env.OPENAI_MAX_TOKENS) || 6000)
      })
    });
    let data;
    try {
      data = await upstream.json();
    } catch (err) {
      res.status(502).json({ error: { message: '上游响应解析失败' } });
      return;
    }
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: { message: err.message || '服务器错误' } });
  }
};
