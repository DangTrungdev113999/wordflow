import type { AIProvider, AIMessage, AIResponse } from './aiProvider';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const STORAGE_KEY = 'wordflow_gemini_api_key';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

function toGeminiMessages(messages: AIMessage[]): {
  systemInstruction?: { parts: { text: string }[] };
  contents: { role: string; parts: { text: string }[] }[];
} {
  const systemMessages = messages.filter((m) => m.role === 'system');
  const chatMessages = messages.filter((m) => m.role !== 'system');

  const systemInstruction = systemMessages.length > 0
    ? { parts: [{ text: systemMessages.map((m) => m.content).join('\n') }] }
    : undefined;

  const contents = chatMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  return { systemInstruction, contents };
}

export const geminiProvider: AIProvider = {
  name: 'Gemini',

  isAvailable(): boolean {
    const key = getApiKey();
    return key !== null && key.length > 0;
  },

  async chat(messages: AIMessage[], config?: { maxTokens?: number; temperature?: number }): Promise<AIResponse> {
    const apiKey = getApiKey();
    if (!apiKey) throw new ApiError('Gemini API key not configured', 401);

    const { systemInstruction, contents } = toGeminiMessages(messages);

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        maxOutputTokens: config?.maxTokens ?? 1024,
        temperature: config?.temperature ?? 0.7,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = systemInstruction;
    }

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new ApiError(`Gemini API error: ${res.status}`, res.status);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text ?? '';

    return {
      text,
      usage: data.usageMetadata
        ? {
            inputTokens: data.usageMetadata.promptTokenCount ?? 0,
            outputTokens: data.usageMetadata.candidatesTokenCount ?? 0,
          }
        : undefined,
    };
  },
};
