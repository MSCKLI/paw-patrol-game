# 🐕 汪汪队 AI 换宠 API

一键部署到 Vercel，获取 AI 宠物生成功能。

## 🚀 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MSCKLI/paw-patrol-game/tree/main/api/vercel&env=COZE_API_KEY&envDescription=Coze%20API%20Key%20用于%20AI%20图像生成&project-name=paw-patrol-ai)

## 📋 部署步骤

### 步骤 1：点击部署按钮
点击上方的 "Deploy with Vercel" 按钮

### 步骤 2：登录 Vercel
- 使用 GitHub 账号登录（最快）
- 或使用邮箱注册

### 步骤 3：设置环境变量
在部署页面设置：
- **Name**: `COZE_API_KEY`
- **Value**: （已预填，无需修改）

### 步骤 4：完成部署
点击 Deploy 按钮，等待部署完成

### 步骤 5：获取 API 地址
部署完成后，复制你的 Vercel 域名，例如：
```
https://paw-patrol-ai-xxx.vercel.app
```

## 🔧 配置前端

部署完成后，更新前端 `index.html` 中的 API 地址：
```javascript
const API_BASE_URL = 'https://你的vercel域名.vercel.app';
```

## 📖 API 接口

### 健康检查
```
GET /api/generate-pet
```

### 生成宠物图片
```
POST /api/generate-pet
Content-Type: application/json

{
  "prompt": "可爱的小狗",
  "petName": "毛毛",
  "style": "电影级3D卡通风格"
}
```
