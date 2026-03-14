// 本地测试 API 服务器
import express from 'express';
import cors from 'cors';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;

// 配置 SDK
const config = new Config({
  apiKey: process.env.COZE_WORKLOAD_IDENTITY_API_KEY,
});

// 健康检查
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Paw Patrol AI API (Local)',
    hasApiKey: !!process.env.COZE_WORKLOAD_IDENTITY_API_KEY
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 生成宠物图片
app.post('/api/generate-pet', async (req, res) => {
  try {
    const { prompt, petName, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '请提供生成提示词' });
    }

    console.log('开始生成图片:', { prompt, petName, style });

    const client = new ImageGenerationClient(config);

    const enhancedPrompt = `可爱的卡通宠物角色，${prompt}，汪汪队立大功风格，Q版可爱风格，适合儿童，高质量插画，鲜艳色彩，${style || '卡通风格'}`;

    console.log('增强提示词:', enhancedPrompt);

    const response = await client.generate({
      prompt: enhancedPrompt,
      size: '2K',
      watermark: false,
    });

    const helper = client.getResponseHelper(response);

    console.log('生成结果:', { 
      success: helper.success, 
      imageCount: helper.imageUrls?.length,
      errors: helper.errorMessages 
    });

    if (helper.success && helper.imageUrls.length > 0) {
      res.json({
        success: true,
        imageUrl: helper.imageUrls[0],
        petName: petName || 'AI宠物',
      });
    } else {
      res.status(500).json({ error: helper.errorMessages.join(', ') || '图像生成失败' });
    }
  } catch (error) {
    console.error('图像生成错误:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : '服务器内部错误' });
  }
});

// 生成指挥官头像
app.post('/api/generate-captain', async (req, res) => {
  try {
    const { style } = req.body;

    const client = new ImageGenerationClient(config);

    const prompt = `汪汪队立大功指挥官莱德Ryder头像，可爱卡通男孩，带着科技感头盔，勇敢自信的表情，${style || '电影级3D风格'}，高质量角色设计，适合做头像`;

    const response = await client.generate({
      prompt,
      size: '2K',
      watermark: false,
    });

    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      res.json({ success: true, imageUrl: helper.imageUrls[0] });
    } else {
      res.status(500).json({ error: helper.errorMessages.join(', ') || '图像生成失败' });
    }
  } catch (error) {
    console.error('指挥官头像生成错误:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : '服务器内部错误' });
  }
});

app.listen(port, () => {
  console.log(`🚀 API 服务器运行在 http://localhost:${port}`);
  console.log(`📋 API Key 已配置: ${!!process.env.COZE_WORKLOAD_IDENTITY_API_KEY}`);
});
