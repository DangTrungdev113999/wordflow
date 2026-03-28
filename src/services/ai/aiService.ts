import type { AIMessage, AIResponse } from './aiProvider';
import { AIUnavailableError, isRateLimitError } from './aiProvider';
import { geminiProvider } from './geminiProvider';
import { groqProvider } from './groqProvider';
import { RateLimiter } from './rateLimiter';

class AIService {
  private providers = [geminiProvider, groqProvider];
  private rateLimiter = new RateLimiter();

  async chat(messages: AIMessage[], opts?: { feature?: string; maxTokens?: number; temperature?: number }): Promise<AIResponse> {
    await this.rateLimiter.acquire(opts?.feature);

    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;
      try {
        return await provider.chat(messages, {
          maxTokens: opts?.maxTokens,
          temperature: opts?.temperature,
        });
      } catch (e) {
        if (isRateLimitError(e)) continue;
        throw e;
      }
    }

    throw new AIUnavailableError('No AI provider available. Please configure an API key in Settings.');
  }

  hasAnyProvider(): boolean {
    return this.providers.some((p) => p.isAvailable());
  }
}

export const aiService = new AIService();
