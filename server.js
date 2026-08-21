const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4173;
const ROOT = path.join(__dirname, 'public');
const SERVER_API_KEY = process.env.OPENAI_API_KEY || '';
const SERVER_BASE_URL = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
const SERVER_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const SERVER_TEMPERATURE = Number(process.env.OPENAI_TEMPERATURE) || 0.8;
const SERVER_MAX_TOKENS = Number(process.env.OPENAI_MAX_TOKENS) || 6000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(body);
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  if (filePath.endsWith(path.sep)) filePath = path.join(filePath, 'index.html');
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      fs.stat(filePath, (err2, stat2) => {
        if (err2 || !stat2.isFile()) return notFound(res);
        readAndSend(res, filePath);
      });
      return;
    }
    if (err || !stat.isFile()) return notFound(res);
    readAndSend(res, filePath);
  });
}

function readAndSend(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) return notFound(res);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error('payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function proxyChat(req, res) {
  try {
    const body = await readBody(req);
    const payload = JSON.parse(body || '{}');
    const baseUrl = (payload.baseUrl || SERVER_BASE_URL).replace(/\/+$/, '');
    const url = /\/chat\/completions$/.test(baseUrl) ? baseUrl : baseUrl + '/chat/completions';
    const apiKey = payload.apiKey || SERVER_API_KEY;
    if (!apiKey) {
      sendJson(res, 400, { error: { message: '未配置 API Key' } });
      return;
    }
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: payload.model || SERVER_MODEL,
        messages: payload.messages || [],
        temperature: payload.temperature ?? SERVER_TEMPERATURE,
        max_tokens: payload.max_tokens ?? SERVER_MAX_TOKENS
      })
    });
    let data;
    try {
      data = await upstream.json();
    } catch (err) {
      sendJson(res, 502, { error: { message: '上游响应解析失败' } });
      return;
    }
    sendJson(res, upstream.status, data);
  } catch (err) {
    sendJson(res, 500, { error: { message: err.message || '服务器错误' } });
  }
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    res.end();
    return;
  }
  if (req.method === 'POST' && req.url.startsWith('/api/chat')) {
    proxyChat(req, res);
    return;
  }
  if (req.method === 'GET' && req.url.startsWith('/api/config')) {
    sendJson(res, 200, {
      serverConfigured: !!SERVER_API_KEY,
      baseUrl: SERVER_BASE_URL,
      model: SERVER_MODEL,
      temperature: SERVER_TEMPERATURE,
      maxTokens: SERVER_MAX_TOKENS
    });
    return;
  }
  if (req.method === 'GET' && req.url.startsWith('/api/health')) {
    sendJson(res, 200, { ok: true });
    return;
  }
  if (req.method === 'GET' || req.method === 'HEAD') {
    serveStatic(req, res);
    return;
  }
  res.writeHead(405);
  res.end('Method Not Allowed');
});

server.listen(PORT, () => {
  console.log('Create running at http://localhost:' + PORT);
});
