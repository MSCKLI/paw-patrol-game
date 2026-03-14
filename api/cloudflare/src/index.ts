/**
 * Cloudflare Workers API - AI 宠物图像生成
 * 
 * 部署步骤：
 * 1. cd api/cloudflare
 * 2. npm install
 * 3. npx wrangler login  (登录 Cloudflare 账号)
 * 4. npx wrangler deploy
 * 5. 复制输出的 URL，更新 index.html 中的 API_BASE_URL
 */

import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 返回 JSON 响应
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// 生成宠物图片
async function generatePet(request: Request): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { prompt, petName, style } = body;

    if (!prompt) {
      return jsonResponse({ error: '请提供生成提示词' }, 400);
    }

    const config = new Config();
    const client = new ImageGenerationClient(config);

    const enhancedPrompt = `可爱的卡通宠物角色，${prompt}，汪汪队立大功风格，Q版可爱风格，适合儿童，高质量插画，鲜艳色彩，${style || '卡通风格'}`;

    const response = await client.generate({
      prompt: enhancedPrompt,
      size: '2K',
      watermark: false,
    });

    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      return jsonResponse({
        success: true,
        imageUrl: helper.imageUrls[0],
        petName: petName || 'AI宠物',
      });
    } else {
      return jsonResponse({ error: helper.errorMessages.join(', ') || '图像生成失败' }, 500);
    }
  } catch (error) {
    console.error('图像生成错误:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : '服务器内部错误' }, 500);
  }
}

// 生成指挥官头像
async function generateCaptain(request: Request): Promise<Response> {
  try {
    const body = await request.json() as any;
    const { style } = body;

    const config = new Config();
    const client = new ImageGenerationClient(config);

    const prompt = `汪汪队立大功指挥官莱德Ryder头像，可爱卡通男孩，带着科技感头盔，勇敢自信的表情，${style || '电影级3D风格'}，高质量角色设计，适合做头像`;

    const response = await client.generate({
      prompt,
      size: '2K',
      watermark: false,
    });

    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      return jsonResponse({ success: true, imageUrl: helper.imageUrls[0] });
    } else {
      return jsonResponse({ error: helper.errorMessages.join(', ') || '图像生成失败' }, 500);
    }
  } catch (error) {
    console.error('指挥官头像生成错误:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : '服务器内部错误' }, 500);
  }
}

// 主入口
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理 CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 路由处理
    if (path === '/api/generate-pet' && request.method === 'POST') {
      return generatePet(request);
    }

    if (path === '/api/generate-captain' && request.method === 'POST') {
      return generateCaptain(request);
    }

    // 健康检查
    if (path === '/api/health' || path === '/') {
      return jsonResponse({ status: 'ok', service: 'Paw Patrol AI API', timestamp: new Date().toISOString() });
    }

    return jsonResponse({ error: 'Not Found' }, 404);
  },
};
