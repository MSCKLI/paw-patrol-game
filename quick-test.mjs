// 简单的本地测试
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

async function test() {
  console.log('测试 AI 图像生成...\n');
  
  const config = new Config({
    apiKey: process.env.COZE_WORKLOAD_IDENTITY_API_KEY,
  });
  
  const client = new ImageGenerationClient(config);
  
  const response = await client.generate({
    prompt: '汪汪队立大功风格的消防犬毛毛，可爱卡通形象，电影级3D风格',
    size: '2K',
    watermark: false,
  });
  
  const helper = client.getResponseHelper(response);
  
  if (helper.success) {
    console.log('✅ 成功!');
    console.log('图片 URL:', helper.imageUrls[0]);
  } else {
    console.log('❌ 失败:', helper.errorMessages);
  }
}

test();
