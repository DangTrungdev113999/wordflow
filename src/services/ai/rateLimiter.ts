interface TokenBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number; // tokens per ms
}

function createBucket(maxTokens: number, refillPerMinute: number): TokenBucket {
  return {
    tokens: maxTokens,
    lastRefill: Date.now(),
    maxTokens,
    refillRate: refillPerMinute / 60000,
  };
}

function refill(bucket: TokenBucket): void {
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + elapsed * bucket.refillRate);
  bucket.lastRefill = now;
}

function tryConsume(bucket: TokenBucket): boolean {
  refill(bucket);
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }
  return false;
}

function msUntilAvailable(bucket: TokenBucket): number {
  refill(bucket);
  if (bucket.tokens >= 1) return 0;
  return Math.ceil((1 - bucket.tokens) / bucket.refillRate);
}

export class RateLimiter {
  private globalBucket: TokenBucket;
  private featureBuckets: Map<string, TokenBucket> = new Map();

  constructor() {
    this.globalBucket = createBucket(10, 10); // 10 req/min global
  }

  async acquire(feature?: string): Promise<void> {
    // Check global bucket
    if (!tryConsume(this.globalBucket)) {
      const waitMs = msUntilAvailable(this.globalBucket);
      await this.delay(waitMs);
      // Retry after waiting
      if (!tryConsume(this.globalBucket)) {
        await this.delay(msUntilAvailable(this.globalBucket));
        tryConsume(this.globalBucket);
      }
    }

    // Check feature bucket
    if (feature) {
      let bucket = this.featureBuckets.get(feature);
      if (!bucket) {
        bucket = createBucket(5, 5); // 5 req/min per feature
        this.featureBuckets.set(feature, bucket);
      }
      if (!tryConsume(bucket)) {
        const waitMs = msUntilAvailable(bucket);
        await this.delay(waitMs);
        if (!tryConsume(bucket)) {
          await this.delay(msUntilAvailable(bucket));
          tryConsume(bucket);
        }
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
