const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://opsora-gateway.opsora-ai.workers.dev';
const GATEWAY_URL = `${API_BASE}/v1/chat/completions`;

export const AVAILABLE_MODELS = [
  { value: 'auto', label: '🤖 Auto (Smart Routing)', provider: 'multi' },
  { value: 'nvidia/nemotron-mini-4b-instruct', label: '⚡ Nemotron Mini 4B (Fast)', provider: 'nvidia' },
  { value: 'nvidia/nemotron-3-super-120b-a12b', label: '🧠 Nemotron Super 120B (Reasoning)', provider: 'nvidia' },
  { value: 'nvidia/nemotron-3-ultra-550b-a55b', label: '🏆 Nemotron Ultra 550B (Ultra)', provider: 'nvidia' },
  { value: 'deepseek-ai/deepseek-v4-flash', label: '💻 DeepSeek V4 Flash (Coding)', provider: 'deepseek' },
  { value: 'meta/llama-3.2-90b-vision-instruct', label: '👁️ Llama 3.2 90B Vision', provider: 'meta' },
  { value: 'qwen/qwen3-235b-a22b', label: '🌐 Qwen3 235B (General)', provider: 'alibaba' },
  { value: 'openai/gpt-4o', label: '⭐ GPT-4o (Premium)', provider: 'openai' },
  { value: 'openai/gpt-4o-mini', label: '💨 GPT-4o Mini (Fast)', provider: 'openai' },
];

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatStreamCallbacks {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
  onModel?: (model: string) => void;
  onUsage?: (tokens: number, cost: number) => void;
}

export async function chatStream(
  messages: ChatMessage[],
  model: string | undefined,
  callbacks: ChatStreamCallbacks
): Promise<AbortController> {
  const controller = new AbortController();

  const token = typeof window !== 'undefined' ? localStorage.getItem('opsora_token') : null;

  const body: Record<string, unknown> = {
    model: model === 'auto' ? undefined : model,
    messages,
    stream: true,
  };

  // Remove undefined model key
  if (!body.model) delete body.model;

  try {
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || 'demo-token'}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body stream');
    }

    let totalTokens = 0;
    let totalCost = 0;
    let buffer = '';

    const pump = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            callbacks.onDone();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                callbacks.onDone();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || '';
                const reasoning = parsed.choices?.[0]?.delta?.reasoning_content || '';
                const modelName = parsed.model || '';
                const usage = parsed.usage;

                if (delta) {
                  callbacks.onToken(delta);
                  totalTokens += delta.split(/\s+/).filter(Boolean).length;
                }
                if (reasoning) {
                  callbacks.onToken(reasoning);
                }
                if (modelName && callbacks.onModel) {
                  callbacks.onModel(modelName);
                }
                if (usage) {
                  const tokens = usage.total_tokens || 0;
                  const inputCost = (usage.prompt_tokens || 0) / 1_000_000 * 0.5;
                  const outputCost = (usage.completion_tokens || 0) / 1_000_000 * 1.0;
                  totalCost = inputCost + outputCost;
                  if (callbacks.onUsage) {
                    callbacks.onUsage(tokens, totalCost);
                  }
                }
              } catch {
                // Skip unparseable chunks
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        callbacks.onError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    pump();
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      callbacks.onDone();
    } else {
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  return controller;
}

export async function checkGatewayHealth(): Promise<{
  status: string;
  models: number;
  providers: string[];
}> {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return {
      status: data.status || 'healthy',
      models: data.models || 0,
      providers: data.providers || [],
    };
  } catch {
    return { status: 'unreachable', models: 0, providers: [] };
  }
}

export interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  modelBreakdown: Record<string, { requests: number; tokens: number; cost: number }>;
  dailyRequests: { date: string; count: number }[];
}

export async function getUsageStats(period: '7d' | '30d' | 'all' = '7d'): Promise<UsageStats> {
  try {
    const response = await fetch(`${API_BASE}/v1/usage?period=${period}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    // Return mock data for demo
    return {
      totalRequests: 14203,
      totalTokens: 2450000,
      totalCost: 12.45,
      modelBreakdown: {
        'Nemotron Mini 4B': { requests: 5230, tokens: 890000, cost: 2.45 },
        'Nemotron Super 120B': { requests: 3420, tokens: 720000, cost: 4.80 },
        'DeepSeek V4': { requests: 2890, tokens: 510000, cost: 2.10 },
        'GPT-4o': { requests: 1560, tokens: 280000, cost: 2.90 },
        'Other': { requests: 1103, tokens: 50000, cost: 0.20 },
      },
      dailyRequests: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10),
        count: Math.floor(Math.random() * 500) + 100,
      })),
    };
  }
}