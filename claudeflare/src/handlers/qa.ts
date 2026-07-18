// ##############  QA HANDLER  ##############
// Save, retrieve, and delete Q&A conversations per note

import type { Env, QaData, QaConversation } from '../types';
import { errorResponse, successResponse } from './auth';

type AuthedCtx = { token: string };

const MAX_CONVERSATIONS = 50;

function generateQaId(): string {
  return `qa_${crypto.randomUUID().replace(/-/g, '')}`;
}

// POST /api/llm/save
export async function handleSave(
  request: Request,
  env: Env,
  ctx: AuthedCtx
): Promise<Response> {
  try {
    const body = (await request.json()) as {
      noteId?: string;
      title?: string;
      content?: string;
    };

    if (!body.noteId || !body.content) {
      return errorResponse('noteId and content are required', 400);
    }

    const key = `user:${ctx.token}:qa:${body.noteId}`;
    const existingRaw = await env.UMEBOSHI_KV.get(key);

    let data: QaData;
    if (existingRaw) {
      data = JSON.parse(existingRaw);
    } else {
      data = { noteId: body.noteId, conversations: [] };
    }

    const conversation: QaConversation = {
      id: generateQaId(),
      title: (body.title && body.title.trim())
        ? body.title.trim().substring(0, 50)
        : body.content.substring(0, 50) + (body.content.length > 50 ? '...' : ''),
      content: body.content,
      savedAt: new Date().toISOString(),
    };

    data.conversations.push(conversation);

    // Enforce max limit
    if (data.conversations.length > MAX_CONVERSATIONS) {
      data.conversations = data.conversations.slice(-MAX_CONVERSATIONS);
    }

    await env.UMEBOSHI_KV.put(key, JSON.stringify(data));

    return successResponse({
      id: conversation.id,
      savedAt: conversation.savedAt,
    });
  } catch (err) {
    return errorResponse(
      `Save failed: ${err instanceof Error ? err.message : String(err)}`,
      500
    );
  }
}

// GET /api/llm/qa/:noteId
export async function handleGetByNoteId(
  noteId: string,
  env: Env,
  ctx: AuthedCtx
): Promise<Response> {
  try {
    const key = `user:${ctx.token}:qa:${noteId}`;
    const raw = await env.UMEBOSHI_KV.get(key);

    if (!raw) {
      return successResponse({ noteId, conversations: [] });
    }

    const data: QaData = JSON.parse(raw);
    return successResponse(data);
  } catch (err) {
    return errorResponse(
      `Get QA failed: ${err instanceof Error ? err.message : String(err)}`,
      500
    );
  }
}

// PATCH /api/llm/save/:qaId
export async function handleUpdate(
  qaId: string,
  request: Request,
  env: Env,
  ctx: AuthedCtx
): Promise<Response> {
  try {
    const body = (await request.json()) as {
      noteId?: string;
      title?: string;
      content?: string;
    };

    if (!body.noteId || !body.content) {
      return errorResponse('noteId and content are required', 400);
    }

    const key = `user:${ctx.token}:qa:${body.noteId}`;
    const raw = await env.UMEBOSHI_KV.get(key);

    if (!raw) {
      return errorResponse('Q&A data not found', 404);
    }

    const data: QaData = JSON.parse(raw);
    const conv = data.conversations.find((c) => c.id === qaId);

    if (!conv) {
      return errorResponse('Q&A entry not found', 404);
    }

    conv.title = (body.title && body.title.trim())
      ? body.title.trim().substring(0, 50)
      : body.content.substring(0, 50) + (body.content.length > 50 ? '...' : '');
    conv.content = body.content;
    conv.savedAt = new Date().toISOString();

    await env.UMEBOSHI_KV.put(key, JSON.stringify(data));

    return successResponse({
      id: conv.id,
      savedAt: conv.savedAt,
    });
  } catch (err) {
    return errorResponse(
      `Update failed: ${err instanceof Error ? err.message : String(err)}`,
      500
    );
  }
}

// DELETE /api/llm/qa/:noteId/:qaId
export async function handleDelete(
  noteId: string,
  qaId: string,
  env: Env,
  ctx: AuthedCtx
): Promise<Response> {
  try {
    const key = `user:${ctx.token}:qa:${noteId}`;
    const raw = await env.UMEBOSHI_KV.get(key);

    if (!raw) {
      return errorResponse('Q&A data not found', 404);
    }

    const data: QaData = JSON.parse(raw);
    const before = data.conversations.length;
    data.conversations = data.conversations.filter((c) => c.id !== qaId);

    if (data.conversations.length === before) {
      return errorResponse('Q&A entry not found', 404);
    }

    await env.UMEBOSHI_KV.put(key, JSON.stringify(data));
    return successResponse({ deleted: true });
  } catch (err) {
    return errorResponse(
      `Delete failed: ${err instanceof Error ? err.message : String(err)}`,
      500
    );
  }
}
