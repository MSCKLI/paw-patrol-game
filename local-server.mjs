// 本地 API 服务器
import { createServer } from 'http';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

const port = 5000;
const config = new Config({
  apiKey: process.env.COZE_WORKLOAD_IDENTITY_API_KEY,
});

const server = createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${port}`);
  
  // 健康检查
  if (url.pathname === '/' || url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      hasApiKey: !!process.env.COZE_WORKLOAD_IDENTITY_API_KEY 
    }));
    return;
  }

  // 生成宠物图片
  if (url.pathname === '/api/generate-pet' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { prompt, petName, style } = JSON.parse(body);
        console.log('生成请求:', { prompt, petName, style });

        const client = new ImageGenerationClient(config);
        const enhancedPrompt = `可爱的卡通宠物角色，${prompt}，汪汪队立大功风格，Q版可爱风格，适合儿童，高质量插画，鲜艳色彩，${style || '卡通风格'}`;

        const response = await client.generate({
          prompt: enhancedPrompt,
          size: '2K',
          watermark: false,
        });

        const helper = client.getResponseHelper(response);

        if (helper.success && helper.imageUrls.length > 0) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            imageUrl: helper.imageUrls[0],
            petName: petName || 'AI宠物',
          }));
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: helper.errorMessages.join(', ') || '生成失败' }));
        }
      } catch (error) {
        console.error('错误:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // 生成指挥官头像
  if (url.pathname === '/api/generate-captain' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { style } = JSON.parse(body);
        const client = new ImageGenerationClient(config);
        const prompt = `汪汪队立大功指挥官莱德Ryder头像，可爱卡通男孩，带着科技感头盔，${style || '电影级3D风格'}`;

        const response = await client.generate({
          prompt,
          size: '2K',
          watermark: false,
        });

        const helper = client.getResponseHelper(response);

        if (helper.success && helper.imageUrls.length > 0) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, imageUrl: helper.imageUrls[0] }));
        } else {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: helper.errorMessages.join(', ') || '生成失败' }));
        }
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // 静态文件服务
  if (url.pathname === '/index.html' || url.pathname === '/') {
    const fs = await import('fs');
    const content = fs.readFileSync('/workspace/projects/index.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(port, () => {
  console.log(`🚀 服务器运行在 http://localhost:${port}`);
  console.log(`📋 API Key 已配置: ${!!process.env.COZE_WORKLOAD_IDENTITY_API_KEY}`);
});
