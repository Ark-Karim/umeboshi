// ##############  CLOUDFLARE WORKER TYPES  ##############

// Environment bindings
export interface Env {
  UMEBOSHI_KV: KVNamespace;
  LLM_API_KEY: string;
  LLM_ENDPOINT: string;
  LLM_MODEL: string;
}

// User settings (localStorage structure)
export interface UserSettings {
  version: number;
  claudeflareToken: string;
  claudeflareUrl: string;
  ui: {
    fontSize: number;
    countdownEnabled: boolean;
    llmEnabled: boolean;
    autoFlip: boolean;
    ttsEnabled: boolean;
    countdownBrainRestSec: number;
    easySecond: number;
    hardSecond: number;
  };
  hints: {
    autoRevealHints: Record<string, boolean>;
  };
  updatedAt: string;
}

// Q&A conversation entry
export interface QaConversation {
  id: string;
  title: string;
  content: string;
  savedAt: string;
}

// Q&A data per note
export interface QaData {
  noteId: string;
  conversations: QaConversation[];
}

// User metadata (usage tracking)
export interface UserMeta {
  requestCount: number;
  tokenUsage: { input: number; output: number };
  resetAt: string;
}

// Invite code
export interface InviteCode {
  code: string;
  usedBy?: string;
  createdAt: string;
}

// API common response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// SSE chunk from LLM
export interface SseChunk {
  type: 'chunk' | 'done' | 'error';
  content?: string;
  usage?: { input: number; output: number };
}
