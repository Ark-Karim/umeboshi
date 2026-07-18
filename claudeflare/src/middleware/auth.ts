// ##############  AUTH MIDDLEWARE  ##############
// Validates Bearer token from Authorization header

import type { Env } from '../types';
import { validateToken, errorResponse } from '../handlers/auth';

export type HandlerFn = (
  request: Request,
  env: Env,
  ctx: { token: string }
) => Promise<Response>;

// Extract and validate token, then call handler
export function withAuth(handler: HandlerFn): (
  request: Request,
  env: Env
) => Promise<Response> {
  return async (request: Request, env: Env): Promise<Response> => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('Missing or invalid Authorization header', 401);
    }

    const token = authHeader.slice(7);
    const valid = await validateToken(token, env);
    if (!valid) {
      return errorResponse('Invalid or expired token', 401);
    }

    return handler(request, env, { token });
  };
}
