// ##############  LLM PROXY HANDLER  ##############
// Proxies LLM requests with SSE streaming support

import type { Env, UserMeta } from '../types';
import { errorResponse } from './auth';

type AuthedCtx = { token: string };

// Record usage to KV
export async function recordUsage(
  token: string,
  usage: { input: number; output: number },
  env: Env
): Promise<void> {
  const metaRaw = await env.UMEBOSHI_KV.get(`user:${token}:meta`);
  const meta: UserMeta = metaRaw
    ? JSON.parse(metaRaw)
    : { requestCount: 0, tokenUsage: { input: 0, output: 0 }, resetAt: '' };

  meta.requestCount += 1;
  meta.tokenUsage.input += usage.input;
  meta.tokenUsage.output += usage.output;

  await env.UMEBOSHI_KV.put(`user:${token}:meta`, JSON.stringify(meta));
}


// Build the LLM request body for OpenAI-compatible API
function buildLlmRequest(
  message: string,
  context: { text?: string; extra?: string },
  env: Env,
  thinking?: { enabled: boolean; budget?: number }
): { url: string; headers: Record<string, string>; body: object } {
  const systemParts = [
    'You are the Passionate but concise Pathophysiology Professor. ',
    'Answer questions with the conclusion first at a first-year medical student level. ',
    'Answer directly only to the core of the users question, and do not provide redundant explanations about the attached problem statement. ',
    'Keep the output as concise as possible to reduce cognitive load. Frequently use tables, bullet points, and arrow-based step formats. ',
    '\nAlways respond in the following JSON format:\n{"title": "Title the response in the form of a question. (example: xxxとは何か？, xxxがxxxなのはなぜか？, xxxはどのようにして起こるのか？)(max 50 chars)", "content": "Your response in MD"}\nDo not include any text outside JSON object. ',
    'Respond in Japanese.',
  ];

  if (context.text) {
    systemParts.push(`\n\nCard Text:\n${context.text}`);
  }
  if (context.extra) {
    systemParts.push(`\n\nCard Extra:\n${context.extra}`);
  }

  const body: Record<string, unknown> = {
    model: env.LLM_MODEL,
    max_tokens: 2048,
    stream: true,
    stream_options: { include_usage: true },
    messages: [
      { role: 'system', content: systemParts.join('\n') },
      { role: 'user', content: message },
    ],
  };

  // Thinking support (DeepSeek R1 / Claude extended thinking)
  if (thinking?.enabled) {
    // DeepSeek R1: use reasoning_effort or thinking budget
    if (thinking.budget && thinking.budget > 0) {
      body.reasoning_effort = thinking.budget;
    }
    // Claude: extended_thinking parameter
    body.extended_thinking = {
      enabled: true,
      ...(thinking.budget ? { budget_tokens: thinking.budget } : {}),
    };
  }

  return {
    url: env.LLM_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.LLM_API_KEY}`,
    },
    body,
  };
}

// Stream LLM response as SSE
export async function handleChat(
  request: Request,
  env: Env,
  ctx: AuthedCtx
): Promise<Response> {
  try {
    const body = (await request.json()) as {
      message?: string;
      context?: { text?: string; extra?: string };
      provider?: string;
      thinking?: { enabled?: boolean; budget?: number };
    };

    if (!body.message) {
      return errorResponse('message is required', 400);
    }

    const llmReq = buildLlmRequest(
      body.message,
      body.context || {},
      env,
      body.thinking?.enabled ? { enabled: true, budget: body.thinking.budget } : undefined
    );

    // Call LLM API with streaming
    const llmResponse = await fetch(llmReq.url, {
      method: 'POST',
      headers: llmReq.headers,
      body: JSON.stringify(llmReq.body),
    });

    if (!llmResponse.ok) {
      const errText = await llmResponse.text();
      return errorResponse(`LLM API error ${llmResponse.status}: ${errText}`, 502);
    }

    // Create SSE stream from LLM response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let inputTokens = 0;
    let outputTokens = 0;

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // Process the stream in background
    const processStream = async () => {
      try {
        const reader = llmResponse.body!.getReader();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);

              // Thinking content (DeepSeek R1: reasoning_content, Claude: thinking)
              const thinkingContent =
                parsed.choices?.[0]?.delta?.reasoning_content ||
                parsed.choices?.[0]?.delta?.thinking;
              if (thinkingContent) {
                const chunk = JSON.stringify({
                  type: 'thinking',
                  content: thinkingContent,
                });
                await writer.write(encoder.encode(`data: ${chunk}\n\n`));
              }

              // OpenAI-compatible streaming format
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                const chunk = JSON.stringify({
                  type: 'chunk',
                  content,
                });
                await writer.write(encoder.encode(`data: ${chunk}\n\n`));
              }

              // Usage info (sent in final chunk when stream_options.include_usage is true)
              if (parsed.usage) {
                inputTokens = parsed.usage.prompt_tokens || 0;
                outputTokens = parsed.usage.completion_tokens || 0;
              }
            } catch {
              // Skip unparseable lines
            }
          }
        }

        // Send done event
        const doneChunk = JSON.stringify({
          type: 'done',
          usage: { input: inputTokens, output: outputTokens },
        });
        await writer.write(encoder.encode(`data: ${doneChunk}\n\n`));

        // Record usage asynchronously
        recordUsage(ctx.token, { input: inputTokens, output: outputTokens }, env).catch(
          () => {}
        );
      } catch (err) {
        const errChunk = JSON.stringify({
          type: 'error',
          content: err instanceof Error ? err.message : 'Stream error',
        });
        try {
          await writer.write(encoder.encode(`data: ${errChunk}\n\n`));
        } catch {}
      } finally {
        try {
          await writer.close();
        } catch {}
      }
    };

    processStream();

    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    return errorResponse(
      `Chat error: ${err instanceof Error ? err.message : String(err)}`,
      500
    );
  }
}
