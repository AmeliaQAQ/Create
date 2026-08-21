# Create · OC 故事生成器

一个可在公网部署的 OC 故事生成器。所有设定都来自用户，不编造、不 OOC、避免 AI 味表达；API Key 保存在服务器环境变量中，不暴露给访客。

## 本地运行

需要 Node.js 18 或更高版本：

```bash
npm install
npm start
```

然后访问 `http://localhost:4173`。

也可以不配置环境变量，直接在浏览器「API 设置」里填 Key 使用。

## 环境变量

复制 `.env.example` 中的字段，在部署平台里配置：

| 变量 | 说明 |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI 或兼容服务的 API Key |
| `OPENAI_BASE_URL` | API 地址，默认 `https://api.openai.com/v1` |
| `OPENAI_MODEL` | 模型名，默认 `gpt-4o-mini` |
| `OPENAI_TEMPERATURE` | 生成温度，默认 `0.8` |
| `OPENAI_MAX_TOKENS` | 单次最大输出，默认 `6000` |
| `PORT` | 服务端口，默认 `4173` |

## 部署到 Render（推荐）

1. 把整个 `outputs/create` 目录推到 GitHub 仓库。
2. 在 [render.com](https://render.com) 新建 Web Service，连接该仓库。
3. Runtime 选择 Node，Start Command 填 `node server.js`。
4. 在 Environment 里添加 `OPENAI_API_KEY`，其他变量可选。
5. 部署完成后会得到 `https://xxxx.onrender.com` 公网地址。

仓库里已经包含 `render.yaml`，也可以用 Render 的 Blueprint 自动识别。

## 部署到 Railway

1. 把目录推到 GitHub 仓库。
2. 在 [railway.app](https://railway.app) 新建项目，选择 Deploy from GitHub。
3. 添加 `OPENAI_API_KEY` 环境变量。
4. Railway 会自动执行 `npm install` 和 `npm start`。

## 部署到 Vercel

1. 把目录推到 GitHub 仓库。
2. 在 [vercel.com](https://vercel.com) Import 该仓库。
3. 添加 `OPENAI_API_KEY` 环境变量。
4. `api/chat.js` 和 `api/config.js` 会自动作为服务端接口部署。

## 部署到自己的服务器

```bash
docker build -t create-oc-story .
docker run -p 4173:4173 \
  -e OPENAI_API_KEY=sk-your-key \
  -d create-oc-story
```

之后访问 `http://服务器IP:4173`。

## 说明

- 访客在浏览器里只能看到自己的设定和生成结果，无法读取服务器上的 API Key。
- 设定与历史记录默认保存在访客自己的浏览器 localStorage 中。
- 本地没有配置服务器 Key 时，仍可在「API 设置」里填写浏览器端 Key 使用。
