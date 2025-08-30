import OpenAI from 'openai';
import dotenv from 'dotenv';

 dotenv.config()

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.rateLimitDelay = 1000;
    this.lastRequestTime = 0;
  }

  async createChatCompletion(options) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
    return await this.openai.chat.completions.create(options);
  }
}

export default OpenAIService;