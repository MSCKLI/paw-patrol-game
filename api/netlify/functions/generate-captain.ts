/**
 * Netlify Function - 生成指挥官头像
 * 文件路径: /functions/generate-captain.ts
 * 访问路径: /.netlify/functions/generate-captain
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
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          imageUrl: helper.imageUrls[0],
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
    console.error('指挥官头像生成错误:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : '服务器内部错误',
      }),
    };
  }
};
