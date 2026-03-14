/**
 * Netlify Function - 生成宠物图片
 * 文件路径: /functions/generate-pet.ts
 * 访问路径: /.netlify/functions/generate-pet
 */

import { Handler } from '@netlify/functions';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

export const handler: Handler = async (event) => {
  // CORS 处理
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { prompt, petName, style } = body;

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '请提供生成提示词' }),
      };
    }

    const config = new Config();
    const client = new ImageGenerationClient(config);

    // 构建增强的 prompt
    const enhancedPrompt = `可爱的卡通宠物角色，${prompt}，汪汪队立大功风格，Q版可爱风格，适合儿童，高质量插画，鲜艳色彩，${style || '卡通风格'}`;

    const response = await client.generate({
      prompt: enhancedPrompt,
      size: '2K',
      watermark: false,
    });

    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          imageUrl: helper.imageUrls[0],
          petName: petName || 'AI宠物',
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: helper.errorMessages.join(', ') || '图像生成失败',
        }),
      };
    }
  } catch (error) {
    console.error('图像生成错误:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : '服务器内部错误',
      }),
    };
  }
};
