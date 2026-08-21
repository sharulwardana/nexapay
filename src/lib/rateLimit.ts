export interface RateLimitOptions {
  interval: number; // in milliseconds
  uniqueTokenPerInterval: number; // max users per interval
}

export default function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new Map<string, number[]>();
  let lastCleanup = Date.now();

  return {
    check: (limit: number, token: string) => {
      return new Promise<void>((resolve, reject) => {
        const now = Date.now();
        
        // Clean up old entries every 1 minute to prevent memory leak
        if (now - lastCleanup > 60000) {
          tokenCache.forEach((timestamps, key) => {
            const validTimestamps = timestamps.filter(t => now - t < (options?.interval || 60000));
            if (validTimestamps.length === 0) {
              tokenCache.delete(key);
            } else {
              tokenCache.set(key, validTimestamps);
            }
          });
          lastCleanup = now;
        }

        const existingTimestamps = tokenCache.get(token) || [];
        const validTimestamps = existingTimestamps.filter(t => now - t < (options?.interval || 60000));

        if (validTimestamps.length >= limit) {
          reject('Rate limit exceeded');
        } else {
          validTimestamps.push(now);
          tokenCache.set(token, validTimestamps);
          resolve();
        }
      });
    },
  };
}
