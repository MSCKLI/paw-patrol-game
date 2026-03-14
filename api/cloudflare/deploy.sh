#!/bin/bash

# 汪汪队 AI API 部署脚本
# 用于 Cloudflare Workers

echo "=========================================="
echo "🎬 汪汪队立大功 AI API 部署"
echo "=========================================="

cd "$(dirname "$0")"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检查是否已登录
echo ""
echo "📋 部署前请确保："
echo "   1. 已注册 Cloudflare 账号（免费）"
echo "   2. 已运行 'npx wrangler login' 登录"
echo ""
echo "如果未登录，请运行："
echo "   npx wrangler login"
echo ""

# 部署
echo "🚀 开始部署..."
npx wrangler deploy

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo ""
echo "接下来："
echo "1. 复制上面的 Workers URL"
echo "2. 修改 index.html 中的 API_BASE_URL"
echo "3. 上传 index.html 到 GitHub Pages"
echo "=========================================="
