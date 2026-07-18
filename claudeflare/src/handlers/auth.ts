// ##############  AUTH HANDLER  ##############
// Handles invitation code validation, token generation, and user registration

import type { Env, ApiResponse, InviteCode, UserMeta } from '../types';

// Generate a token with cf_ prefix
export function generateToken(): string {
  const uuid = crypto.randomUUID();
  return `cf_${uuid.replace(/-/g, '')}`;
}

// Validate an invite code against KV
export async function validateInviteCode(
  code: string,
  env: Env
): Promise<{ valid: boolean; error?: string }> {
  const raw = await env.UMEBOSHI_KV.get(`invite:${code}`);
  if (!raw) {
    return { valid: false, error: 'Invalid invitation code.' };
  }

  const invite: InviteCode = JSON.parse(raw);
  if (invite.usedBy) {
    return { valid: false, error: 'This invitation code has already been used.' };
  }

  return { valid: true };
}

// Validate a user token (check if settings exist)
export async function validateToken(
  token: string,
  env: Env
): Promise<boolean> {
  const settings = await env.UMEBOSHI_KV.get(`user:${token}:settings`);
  return settings !== null;
}

// Error response helper
export function errorResponse(message: string, status: number): Response {
  const body: ApiResponse = { success: false, error: message };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Success response helper
export function successResponse<T>(data: T, status = 200): Response {
  const body: ApiResponse<T> = { success: true, data };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Default user settings
function getDefaultSettings() {
  return {
    version: 2,
    claudeflareToken: '',
    claudeflareUrl: '',
    ui: {
      fontSize: 28,
      countdownEnabled: true,
      llmEnabled: true,
      autoFlip: true,
      ttsEnabled: false,
      countdownBrainRestSec: 3,
      easySecond: 5,
      hardSecond: 10,
    },
    hints: {
      autoRevealHints: {},
    },
    updatedAt: '',
  };
}

// Default user meta
function getDefaultMeta(): UserMeta {
  return {
    requestCount: 0,
    tokenUsage: { input: 0, output: 0 },
    resetAt: getNextMonthReset(),
  };
}

function getNextMonthReset(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toISOString();
}

// POST /api/auth/register
export async function handleRegister(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = (await request.json()) as {
      inviteCode?: string;
      userId?: string;
    };

    if (!body.inviteCode) {
      return errorResponse('inviteCode is required', 400);
    }

    // Validate invite code
    const validation = await validateInviteCode(body.inviteCode, env);
    if (!validation.valid) {
      return errorResponse(validation.error!, 403);
    }

    // Generate token
    const token = generateToken();

    // Save user settings
    const settings = getDefaultSettings();
    settings.claudeflareToken = token;
    await env.UMEBOSHI_KV.put(
      `user:${token}:settings`,
      JSON.stringify(settings)
    );

    // Save user meta
    const meta = getDefaultMeta();
    await env.UMEBOSHI_KV.put(
      `user:${token}:meta`,
      JSON.stringify(meta)
    );

    // Mark invite code as used
    const inviteRaw = await env.UMEBOSHI_KV.get(`invite:${body.inviteCode}`);
    if (inviteRaw) {
      const invite: InviteCode = JSON.parse(inviteRaw);
      invite.usedBy = token;
      await env.UMEBOSHI_KV.put(
        `invite:${body.inviteCode}`,
        JSON.stringify(invite)
      );
    }

    return successResponse({
      token,
      userId: body.userId || '',
    });
  } catch (e) {
    return errorResponse(
      `Registration failed: ${e instanceof Error ? e.message : String(e)}`,
      500
    );
  }
}

// POST /api/auth/verify
export async function handleVerify(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = (await request.json()) as { token?: string };

    if (!body.token) {
      return errorResponse('token is required', 400);
    }

    const valid = await validateToken(body.token, env);
    return successResponse({ valid });
  } catch (e) {
    return errorResponse(
      `Verify failed: ${e instanceof Error ? e.message : String(e)}`,
      500
    );
  }
}
