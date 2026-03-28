export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  text: string;
  usage?: { inputTokens: number; outputTokens: number };
}

export interface AIProvider {
  name: string;
  chat(messages: AIMessage[], config?: { maxTokens?: number; temperature?: number; signal?: AbortSignal }): Promise<AIResponse>;
  isAvailable(): boolean;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class AIUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIUnavailableError';
  }
}

export function isRateLimitError(e: unknown): boolean {
  if (e instanceof Error && 'status' in e) {
    const status = (e as Error & { status: number }).status;
    return status === 429;
  }
  return false;
}
