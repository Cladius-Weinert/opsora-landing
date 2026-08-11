'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  MessageSquare,
  Settings,
  BarChart3,
  Code,
  Shield,
  ChevronRight,
  Loader2,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const models = [
  { value: 'auto', label: '🤖 Auto (Smart Routing)' },
  { value: 'nvidia/nemotron-mini-4b-instruct', label: '⚡ Nemotron Mini 4B (Fast)' },
  { value: 'nvidia/nemotron-3-super-120b-a12b', label: '🧠 Nemotron Super 120B (Reasoning)' },
  { value: 'nvidia/nemotron-3-ultra-550b-a55b', label: '🏆 Nemotron Ultra 550B (Ultra)' },
  { value: 'deepseek-ai/deepseek-v4-flash', label: '💻 DeepSeek V4 Flash (Coding)' },
  { value: 'meta/llama-3.2-90b-vision-instruct', label: '👁️ Llama 3.2 90B Vision' },
];

export default function LiveDemo() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: '👋 Welcome to Opsora AI! I\'m powered by intelligent multi-provider routing. Try asking me to write code, analyze something, or just chat!' }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [cost, setCost] = useState(0);
  const [currentProvider, setCurrentProvider] = useState('—');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    setTokenCount(0);
    setCost(0);
    setCurrentProvider('Routing...');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('opsora_token') : null;
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || 'https://opsora-gateway.opsora-ai.workers.dev';
      const response = await fetch(`${apiBase}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'demo-token'}`,
        },
        body: JSON.stringify({
          model: selectedModel === 'auto' ? undefined : selectedModel,
          messages: [...messages, userMessage],
          stream: true,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let chunkIndex = messages.length;

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsStreaming(false);
              setCurrentProvider('Complete');
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              const reasoning = parsed.choices?.[0]?.delta?.reasoning_content || '';
              const model = parsed.model || '';
              const usage = parsed.usage;

              if (model && !currentProvider.includes(model.split('/')[0])) {
                setCurrentProvider(model.split('/')[0]);
              }

              if (delta || reasoning) {
                assistantContent += delta + reasoning;
                setMessages(prev => {
                  const next = [...prev];
                  next[chunkIndex] = { ...next[chunkIndex], content: assistantContent };
                  return next;
                });
              }

              if (usage) {
                setTokenCount(usage.total_tokens || 0);
                const inputCost = (usage.prompt_tokens || 0) / 1_000_000 * 0.5;
                const outputCost = (usage.completion_tokens || 0) / 1_000_000 * 1.0;
                setCost(inputCost + outputCost);
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]);
      setIsStreaming(false);
      setCurrentProvider('Error');
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="glass-panel rounded-2xl overflow-hidden h-[600px] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-void-400/20 bg-void-100/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="font-mono text-sm text-muted-foreground">
              {(process.env.NEXT_PUBLIC_API_URL || 'https://opsora-gateway.opsora-ai.workers.dev').replace(/^https?:\/\//, '')}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="input-field py-1 px-3 text-xs min-w-[200px] bg-void-200"
              disabled={isStreaming}
            >
              {models.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <div className="flex items-center gap-2 px-3 py-1 glass-panel rounded-lg">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-void-400'}`} />
              <span className="font-mono text-xs text-emerald-400">{isStreaming ? 'Streaming' : 'Ready'}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-emerald-500/20 text-foreground border border-emerald-500/30 rounded-br-none'
                    : 'bg-void-200/50 text-foreground border border-void-400/20 rounded-bl-none'
                }`}
              >
                <div className="prose prose-invert max-w-none text-sm">
                  {msg.content.split('\n').map((line, li) => (
                    <p key={li} className="whitespace-pre-wrap font-mono text-base leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-void-400/20 bg-void-100/50">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isStreaming ? 'Waiting for response...' : 'Type a message... (Shift+Enter for new line)'}
              className="flex-1 input-field resize-none min-h-[50px] max-h-[150px] font-mono text-sm"
              disabled={isStreaming}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="btn-primary px-6 py-3 whitespace-nowrap disabled:opacity-50"
              aria-label="Send message"
            >
              {isStreaming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Streaming...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}