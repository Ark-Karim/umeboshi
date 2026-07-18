// ##############  RATE LIMIT MIDDLEWARE  ##############
// Per-user rate limiting using KV

import type { Env, UserMeta } from '../types';
import { errorResponse } from '../handlers/auth';

type AuthedHandler = (
  request: Request,
  env: Env,
  ctx: { token: string }
) => Promise<Response>;

const MAX_REQUESTS_PER_MINUTE = 30;
const MAX_MONTHLY_TOKENS = 500_000;

export function withRateLimit(handler: AuthedHandler): AuthedHandler {
  return async (
    request: Request,
    env: Env,
    ctx: { token: string }
  ): Promise<Response> => {
    const { token } = ctx;

    // Check per-minute rate limit
    const rateKey = `rateLimit:${token}:min`;
    const currentCountRaw = await env.UMEBOSHI_KV.get(rateKey);
    const currentCount = currentCountRaw ? parseInt(currentCountRaw, 10) : 0;

    if (currentCount >= MAX_REQUESTS_PER_MINUTE) {
      return errorResponse(
        `Rate limit exceeded. Try again in 60 seconds.`,
        429
      );
    }

    // Increment rate limit counter (TTL 60s)
    await env.UMEBOSHI_KV.put(rateKey, String(currentCount + 1), {
      expirationTtl: 60,
    });

    // Check monthly token usage
    const metaRaw = await env.UMEBOSHI_KV.get(`user:${token}:meta`);
    if (metaRaw) {
      const meta: UserMeta = JSON.parse(metaRaw);
      const totalTokens = meta.tokenUsage.input + meta.tokenUsage.output;

      // Reset if past reset date
      if (meta.resetAt && new Date(meta.resetAt) < new Date()) {
        meta.tokenUsage = { input: 0, output: 0 };
        const now = new Date();
        meta.resetAt = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1
        ).toISOString();
        await env.UMEBOSHI_KV.put(
          `user:${token}:meta`,
          JSON.stringify(meta)
        );
      } else if (totalTokens >= MAX_MONTHLY_TOKENS) {
        return errorResponse(
          `Monthly token limit exceeded (${MAX_MONTHLY_TOKENS.toLocaleString()} tokens). Resets on ${new Date(meta.resetAt).toLocaleDateString()}.`,
          429
        );
      }
    }

    return handler(request, env, ctx);
  };
}
