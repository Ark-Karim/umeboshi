// ##############  ROUTER  ##############
// Maps HTTP requests to handlers

import type { Env } from './types';
import { handleRegister, handleVerify, errorResponse } from './handlers/auth';
import { handleChat } from './handlers/llm';
import { handlePull, handlePush } from './handlers/sync';
import { handleSave, handleUpdate, handleGetByNoteId, handleDelete } from './handlers/qa';
import { handleGetUsage } from './handlers/usage';
import { withAuth } from './middleware/auth';
import { withRateLimit } from './middleware/rateLimit';
import { handleOptions, withCorsHeaders } from './middleware/cors';

type SimpleHandler = (request: Request, env: Env) => Promise<Response>;

// Auth-required handler wrapper (auth extracts token, passes to inner handler)
function authed(
  handler: (req: Request, env: Env, ctx: { token: string }) => Promise<Response>
): SimpleHandler {
  return withAuth(withRateLimit(handler));
}

// Route table
const routes: Record<string, SimpleHandler> = {
  'POST /api/auth/register': handleRegister,
  'POST /api/auth/verify': handleVerify,
  'POST /api/llm/chat': authed(handleChat),
  'POST /api/llm/save': authed(handleSave),
  'POST /api/sync/pull': authed(handlePull),
  'POST /api/sync/push': authed(handlePush),
  'GET /api/usage': authed(handleGetUsage),
};

// Main dispatch function
export async function dispatch(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;

  // Handle OPTIONS preflight
  if (method === 'OPTIONS') {
    return handleOptions();
  }

  // Exact route match
  const key = `${method} ${path}`;
  if (routes[key]) {
    const response = await routes[key](request, env);
    return withCorsHeaders(response);
  }

  // Pattern matches
  // GET /api/llm/qa/:noteId
  const qaGetMatch = path.match(/^\/api\/llm\/qa\/([^/]+)$/);
  if (method === 'GET' && qaGetMatch) {
    const noteId = qaGetMatch[1];
    const handler = authed((req, env, ctx) =>
      handleGetByNoteId(noteId, env, ctx)
    );
    const response = await handler(request, env);
    return withCorsHeaders(response);
  }

  // DELETE /api/llm/qa/:noteId/:qaId
  const qaDeleteMatch = path.match(/^\/api\/llm\/qa\/([^/]+)\/([^/]+)$/);
  if (method === 'DELETE' && qaDeleteMatch) {
    const noteId = qaDeleteMatch[1];
    const qaId = qaDeleteMatch[2];
    const handler = authed((req, env, ctx) =>
      handleDelete(noteId, qaId, env, ctx)
    );
    const response = await handler(request, env);
    return withCorsHeaders(response);
  }

  // PATCH /api/llm/save/:qaId
  const qaUpdateMatch = path.match(/^\/api\/llm\/save\/([^/]+)$/);
  if (method === 'PATCH' && qaUpdateMatch) {
    const qaId = qaUpdateMatch[1];
    const handler = authed((req, env, ctx) =>
      handleUpdate(qaId, req, env, ctx)
    );
    const response = await handler(request, env);
    return withCorsHeaders(response);
  }

  // 404
  return withCorsHeaders(errorResponse('Not Found', 404));
}
