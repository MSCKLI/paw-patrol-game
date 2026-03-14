// 简单测试 SDK 是否工作
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

async function test() {
  console.log('🧪 测试 AI 图像生成...\n');
  console.log('API Key 是否存在:', !!process.env.COZE_WORKLOAD_IDENTITY_API_KEY);
  console.log('API Key 前10位:', process.env.COZE_WORKLOAD_IDENTITY_API_KEY?.substring(0, 10));
  
  try {
    const config = new Config({
      apiKey: process.env.COZE_WORKLOAD_IDENTITY_API_KEY,
    });
    
    console.log('\n📦 创建客户端...');
    const client = new ImageGenerationClient(config);
    
    console.log('🎨 发送生成请求...');
    const response = await client.generate({
      prompt: '可爱的小狗，卡通风格',
      size: '2K',
      watermark: false,
    });
    
    console.log('\n📊 响应:', JSON.stringify(response, null, 2).substring(0, 500));
    
    const helper = client.getResponseHelper(response);
    
    if (helper.success && helper.imageUrls.length > 0) {
      console.log('\n✅ 成功! 图片 URL:', helper.imageUrls[0]);
    } else {
      console.log('\n❌ 失败:', helper.errorMessages);
    }
  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    console.error('堆栈:', error.stack?.substring(0, 300));
  }
}

test();
