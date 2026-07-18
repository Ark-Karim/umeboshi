// ##############  USAGE HANDLER  ##############
// Returns user API usage statistics

import type { Env, UserMeta } from '../types';
import { errorResponse, successResponse } from './auth';

type AuthedCtx = { token: string };

// GET /api/usage
export async function handleGetUsage(
  request: Request,
  env: Env,
  ctx: AuthedCtx
): Promise<Response> {
  try {
    const metaRaw = await env.UMEBOSHI_KV.get(`user:${ctx.token}:meta`);
    const meta: UserMeta = metaRaw
      ? JSON.parse(metaRaw)
      : { requestCount: 0, tokenUsage: { input: 0, output: 0 }, resetAt: '' };

    return successResponse({
      requestCount: meta.requestCount,
      tokenUsage: meta.tokenUsage,
      resetAt: meta.resetAt,
      limits: {
        maxRequestsPerMinute: 30,
        maxMonthlyTokens: 500_000,
      },
    });
  } catch (err) {
    return errorResponse(
      `Usage fetch failed: ${err instanceof Error ? err.message : String(err)}`,
      500
    );
  }
}
