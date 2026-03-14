import type { VercelRequest, VercelResponse } from '@vercel/node';

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 生成图片
async function generateImage(prompt: string, apiKey: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
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
    return { success: false, error: error instanceof Error ? error.message : '请求失败' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, petName, style } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: '请提供生成提示词' });
  }

  const apiKey = process.env.COZE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key 未配置' });
  }

  const enhancedPrompt = `可爱的卡通宠物角色，${prompt}，汪汪队立大功风格，Q版可爱风格，适合儿童，高质量插画，鲜艳色彩，${style || '卡通风格'}`;

  const result = await generateImage(enhancedPrompt, apiKey);

  if (result.success && result.imageUrl) {
    return res.status(200).json({
      success: true,
      imageUrl: result.imageUrl,
      petName: petName || 'AI宠物',
    });
  } else {
    return res.status(500).json({ error: result.error || '图像生成失败' });
  }
}
