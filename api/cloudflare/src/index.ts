/**
 * Cloudflare Workers API - AI 宠物图像生成
 * 使用原生 fetch 调用 Coze API
 */

// 完整的 CORS 头
function getCorsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Origin, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

// 返回 JSON 响应
function jsonResponse(data: any, status = 200, origin = '*'): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(origin),
    },
  });
}

// 使用原生 fetch 调用 Coze API 生成图片
async function generateImage(prompt: string, apiKey: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    // 使用正确的 API 地址
    const response = await fetch('https://api.coze.cn/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'doubao-seedream-4-5-251128',
        prompt: prompt,
        size: '2048x2048',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 错误:', response.status, errorText);
      return { success: false, error: `API 错误 ${response.status}: ${errorText}` };
    }

    const data = await response.json() as any;
    
    if (data.data && data.data.length > 0 && data.data[0].url) {
      return { success: true, imageUrl: data.data[0].url };
    } else if (data.error) {
      return { success: false, error: data.error.message || JSON.stringify(data.error) };
    } else {
      return { success: false, error: '未返回图片 URL' };
    }
  } catch (error) {
    console.error('请求错误:', error);
    return { success: false, error: error instanceof Error ? error.message : '请求失败' };
  }
}

// 生成宠物图片
async function generatePet(request: Request, env: any): Promise<Response> {
  const origin = request.headers.get('Origin') || '*';
  
  try {
    const body = await request.json() as any;
    const { prompt, petName, style } = body;

    if (!prompt) {
      return jsonResponse({ error: '请提供生成提示词' }, 400, origin);
    }

    const apiKey = env.COZE_API_KEY;
    if (!apiKey) {
      console.error('API Key 未配置');
      return jsonResponse({ error: 'API Key 未配置，请联系管理员' }, 500, origin);
    }

    console.log('开始生成图片，提示词:', prompt);

    const enhancedPrompt = `可爱的卡通宠物角色，${prompt}，汪汪队立大功风格，Q版可爱风格，适合儿童，高质量插画，鲜艳色彩，${style || '卡通风格'}`;

    const result = await generateImage(enhancedPrompt, apiKey);

    if (result.success && result.imageUrl) {
      console.log('生成成功:', result.imageUrl);
      return jsonResponse({
        success: true,
        imageUrl: result.imageUrl,
        petName: petName || 'AI宠物',
      }, 200, origin);
    } else {
      console.error('生成失败:', result.error);
      return jsonResponse({ error: result.error || '图像生成失败' }, 500, origin);
    }
  } catch (error) {
    console.error('图像生成错误:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : '服务器内部错误' }, 500, origin);
  }
}

// 生成指挥官头像
async function generateCaptain(request: Request, env: any): Promise<Response> {
  const origin = request.headers.get('Origin') || '*';
  
  try {
    const body = await request.json() as any;
    const { style } = body;

    const apiKey = env.COZE_API_KEY;
    if (!apiKey) {
      return jsonResponse({ error: 'API Key 未配置' }, 500, origin);
    }

    const prompt = `汪汪队立大功指挥官莱德Ryder头像，可爱卡通男孩，带着科技感头盔，勇敢自信的表情，${style || '电影级3D风格'}，高质量角色设计，适合做头像`;

    const result = await generateImage(prompt, apiKey);

    if (result.success && result.imageUrl) {
      return jsonResponse({ success: true, imageUrl: result.imageUrl }, 200, origin);
    } else {
      return jsonResponse({ error: result.error || '图像生成失败' }, 500, origin);
    }
  } catch (error) {
    console.error('指挥官头像生成错误:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : '服务器内部错误' }, 500, origin);
  }
}

// 主入口
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = request.headers.get('Origin') || '*';

    // 处理 CORS 预检请求 - 必须返回 204
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(origin),
      });
    }

    // 路由处理
    if (path === '/api/generate-pet' && request.method === 'POST') {
      return generatePet(request, env);
    }

    if (path === '/api/generate-captain' && request.method === 'POST') {
      return generateCaptain(request, env);
    }

    // 健康检查
    if (path === '/api/health' || path === '/') {
      return jsonResponse({ 
        status: 'ok', 
        service: 'Paw Patrol AI API', 
        timestamp: new Date().toISOString(),
        hasApiKey: !!env.COZE_API_KEY,
        apiEndpoint: 'https://api.coze.cn/v3/images/generations'
      }, 200, origin);
    }

    return jsonResponse({ error: 'Not Found' }, 404, origin);
  },
};
