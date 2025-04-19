import { Message } from '../types/chat';

const API_KEY = 'sk-eudcwozxipqucmymqwwcphujvaduleuykwsbgqjiajpjkloh';
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

export interface LLMResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function chatWithLLM(
  messages: Message[],
  context?: string
): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [
          ...(context ? [{
            role: 'system',
            content: `以下是当前上下文：${context}`
          }] : []),
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LLMResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw error;
  }
} 