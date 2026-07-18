// ##############  CLAUDEFLARE ENTRY POINT  ##############
// Cloudflare Worker entry point

import type { Env } from './types';
import { dispatch } from './router';
import { errorResponse } from './handlers/auth';
import { withCorsHeaders } from './middleware/cors';

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      return await dispatch(request, env);
    } catch (err) {
      console.error('Unhandled error:', err);
      return withCorsHeaders(
        errorResponse('Internal server error', 500)
      );
    }
  },
};
