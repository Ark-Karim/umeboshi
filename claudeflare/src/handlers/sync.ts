// ##############  SYNC HANDLER  ##############
// Settings pull/push via Cloudflare KV

import type { Env, UserSettings } from '../types';
import { errorResponse, successResponse } from './auth';

type AuthedCtx = { token: string };

// Default settings
function getDefaultSettings(): UserSettings {
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

// POST /api/sync/pull
export async function handlePull(
  request: Request,
  env: Env,
  ctx: AuthedCtx
): Promise<Response> {
  try {
    const raw = await env.UMEBOSHI_KV.get(`user:${ctx.token}:settings`);
    if (!raw) {
      return successResponse(getDefaultSettings());
    }

    const settings: UserSettings = JSON.parse(raw);
    return successResponse(settings);
  } catch (err) {
    return errorResponse(
      `Pull failed: ${err instanceof Error ? err.message : String(err)}`,
      500
    );
  }
}

// POST /api/sync/push
export async function handlePush(
  request: Request,
  env: Env,
  ctx: AuthedCtx
): Promise<Response> {
  try {
    const body = (await request.json()) as Partial<UserSettings>;

    // Validate
    if (body.ui) {
      if (body.ui.fontSize !== undefined) {
        if (typeof body.ui.fontSize !== 'number' || body.ui.fontSize < 16 || body.ui.fontSize > 48) {
          return errorResponse('ui.fontSize must be a number between 16 and 48', 400);
        }
      }
    }

    // Load existing or start from defaults
    const existingRaw = await env.UMEBOSHI_KV.get(`user:${ctx.token}:settings`);
    const existing: UserSettings = existingRaw
      ? JSON.parse(existingRaw)
      : getDefaultSettings();

    // Merge incoming fields
    const merged: UserSettings = {
      ...existing,
      ...body,
      ui: { ...existing.ui, ...(body.ui || {}) },
      hints: { ...existing.hints, ...(body.hints || {}) },
      updatedAt: new Date().toISOString(),
    };

    await env.UMEBOSHI_KV.put(
      `user:${ctx.token}:settings`,
      JSON.stringify(merged)
    );

    return successResponse({ savedAt: merged.updatedAt });
  } catch (err) {
    return errorResponse(
      `Push failed: ${err instanceof Error ? err.message : String(err)}`,
      500
    );
  }
}
