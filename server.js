/**
 * 本地开发服务器
 * 用于测试前端和 API
 * 
 * 运行: node server.js
 * 访问: http://localhost:5000
 */

const express = require('express');
const path = require('path');
const { ImageGenerationClient, Config } = require('coze-coding-dev-sdk');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API: 生成宠物图片
app.post('/api/generate-pet', async (req, res) => {
  try {
    const { prompt, petName, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '请提供生成提示词' });
    }

    const config = new Config();
    const client = new ImageGenerationClient(config);

    const enhancedPrompt = `可爱的卡通宠物角色，${prompt}，汪汪队立大功风格，Q版可爱风格，适合儿童，高质量插画，鲜艳色彩，${style || '卡通风格'}`;

    console.log('生成宠物图片:', enhancedPrompt);

    const response = await client.generate({
      prompt: enhancedPrompt,
      size: '2K',
      watermark: false,
    });

    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      res.json({
        success: true,
        imageUrl: helper.imageUrls[0],
        petName: petName || 'AI宠物',
      });
    } else {
      res.status(500).json({
        error: helper.errorMessages.join(', ') || '图像生成失败',
      });
    }
  } catch (error) {
    console.error('图像生成错误:', error);
    res.status(500).json({
      error: error.message || '服务器内部错误',
    });
  }
});

// API: 生成指挥官头像
app.post('/api/generate-captain', async (req, res) => {
  try {
    const { style } = req.body;

    const config = new Config();
    const client = new ImageGenerationClient(config);

    const prompt = `汪汪队立大功指挥官莱德Ryder头像，可爱卡通男孩，带着科技感头盔，勇敢自信的表情，${style || '电影级3D风格'}，高质量角色设计，适合做头像`;

    console.log('生成指挥官头像:', prompt);

    const response = await client.generate({
      prompt,
      size: '2K',
      watermark: false,
    });

    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      res.json({
        success: true,
        imageUrl: helper.imageUrls[0],
      });
    } else {
      res.status(500).json({
        error: helper.errorMessages.join(', ') || '图像生成失败',
      });
    }
  } catch (error) {
    console.error('指挥官头像生成错误:', error);
    res.status(500).json({
      error: error.message || '服务器内部错误',
    });
  }
});

// API: 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 主页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎬 汪汪队立大功：电影级救援行动                          ║
║                                                            ║
║   本地开发服务器已启动！                                   ║
║                                                            ║
║   前端地址: http://localhost:${PORT}                         ║
║   API 文档:                                                ║
║     POST /api/generate-pet    - 生成宠物图片               ║
║     POST /api/generate-captain - 生成指挥官头像            ║
║     GET  /api/health          - 健康检查                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
