# 🚀 AI 功能部署指南

由于 GitHub Pages 是纯静态托管，AI 功能需要一个独立的后端服务。

---

## 方案选择

| 方案 | 难度 | 是否免费 |
|------|------|---------|
| **Cloudflare Workers** | ⭐⭐ 中等 | ✅ 免费（10万次/天） |
| **Netlify Functions** | ⭐ 简单 | ✅ 免费（12.5万次/月） |
| **Vercel Serverless** | ⭐ 简单 | ✅ 免费 |

---

## 方案 1：Cloudflare Workers（推荐）

### 步骤 1：在您的电脑上安装

```bash
# 安装 wrangler
npm install -g wrangler

# 登录 Cloudflare（会打开浏览器）
wrangler login
```

### 步骤 2：部署

```bash
# 进入项目目录
cd api/cloudflare

# 安装依赖
npm install

# 部署
wrangler deploy
```

### 步骤 3：配置前端

部署成功后会得到一个 URL（如 `https://paw-patrol-ai.xxx.workers.dev`），修改 `index.html` 第 1112 行：

```javascript
const API_BASE_URL = 'https://你的workers地址';
```

---

## 方案 2：Vercel（最简单）

### 步骤 1：将代码推送到 GitHub

### 步骤 2：导入到 Vercel

1. 访问 https://vercel.com
2. 点击 "Import Project"
3. 选择您的 GitHub 仓库
4. Vercel 会自动检测并部署

### 步骤 3：配置前端

修改 `index.html`：

```javascript
const API_BASE_URL = 'https://你的项目名.vercel.app';
```

---

## 方案 3：完全在线部署（无需本地环境）

如果您的电脑没有 Node.js 环境，可以：

### 1. 使用 StackBlitz 在线编辑器

1. 访问 https://stackblitz.com
2. 创建新项目
3. 上传 `api/cloudflare` 目录的文件
4. 在终端运行 `wrangler login` 和 `wrangler deploy`

### 2. 使用 GitHub Codespaces

1. 在 GitHub 仓库页面点击 "Code" → "Codespaces"
2. 创建 Codespace
3. 在终端运行部署命令

---

## 🔧 我已经准备好的文件

```
api/
├── cloudflare/          # Cloudflare Workers API
│   ├── src/index.ts     # 主代码
│   ├── wrangler.toml    # 配置
│   ├── package.json     # 依赖
│   └── deploy.sh        # 部署脚本
│
└── netlify/             # Netlify Functions API（备选）
    ├── functions/
    │   ├── generate-pet.ts
    │   └── generate-captain.ts
    └── netlify.toml
```

---

## ❓ 需要帮助？

请告诉我：
1. 您有 Node.js 环境吗？（可以运行 `node -v` 检查）
2. 您有 Cloudflare 账号吗？
3. 您更倾向于哪种部署方式？

我会根据您的情况提供更详细的指导。
