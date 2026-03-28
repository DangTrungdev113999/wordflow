import type { AIProvider, AIMessage, AIResponse } from './aiProvider';
import { ApiError } from './aiProvider';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const STORAGE_KEY = 'wordflow_groq_api_key';

function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export const groqProvider: AIProvider = {
  name: 'Groq',

  isAvailable(): boolean {
    const key = getApiKey();
    return key !== null && key.length > 0;
  },

  async chat(messages: AIMessage[], config?: { maxTokens?: number; temperature?: number; signal?: AbortSignal }): Promise<AIResponse> {
    const apiKey = getApiKey();
    if (!apiKey) throw new ApiError('Groq API key not configured', 401);

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        max_tokens: config?.maxTokens ?? 1024,
        temperature: config?.temperature ?? 0.7,
      }),
      signal: config?.signal,
    });

    if (!res.ok) {
      throw new ApiError(`Groq API error: ${res.status}`, res.status);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? '';

    return {
      text,
      usage: data.usage
        ? {
            inputTokens: data.usage.prompt_tokens ?? 0,
            outputTokens: data.usage.completion_tokens ?? 0,
          }
        : undefined,
    };
  },
};
