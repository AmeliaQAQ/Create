module.exports = async function configHandler(req, res) {
  res.status(200).json({
    serverConfigured: !!process.env.OPENAI_API_KEY,
    baseUrl: (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, ''),
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.8,
    maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 6000
  });
};
