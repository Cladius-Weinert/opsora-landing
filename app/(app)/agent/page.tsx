'use client';

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { useAuth } from '@/lib/auth-context';
import { chatStream, AVAILABLE_MODELS, type ChatMessage } from '@/lib/opsora-api';
import {
  Send,
  StopCircle,
  Sparkles,
  Bot,
  User,
  Cpu,
  Clock,
  DollarSign,
  ChevronDown,
  Loader2,
  Copy,
  Check,
  Trash2,
  MessageSquare,
  Zap,
  ArrowDown,
  RefreshCw,
  Info,
  X,
  Terminal,
  Code,
  Globe,
  Brain,
  Eye,
  Star,
} from 'lucide-react';

const SUGGESTIONS = [
  { icon: Code, label: 'Write a Python script', text: 'Write a Python script that fetches data from an API and saves it to a CSV file' },
  { icon: Brain, label: 'Explain a concept', text: 'Explain how transformer neural networks work in simple terms' },
  { icon: Globe, label: 'Analyze something', text: 'Compare the pros and cons of React vs Vue.js for frontend development' },
  { icon: Terminal, label: 'Debug my code', text: 'I have a React component that\'s not re-rendering when state changes. Can you help me debug?' },
];

const MODEL_GROUPS = [
  {
    label: 'Smart Routing',
    models: AVAILABLE_MODELS.filter(m => m.value === 'auto'),
  },
  {
    label: 'NVIDIA NIM',
    models: AVAILABLE_MODELS.filter(m => m.provider === 'nvidia'),
  },
  {
    label: 'Other Providers',
    models: AVAILABLE_MODELS.filter(m => !['multi', 'nvidia'].includes(m.provider)),
  },
];

export default function AgentPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `👋 Welcome to **Opsora AI Agent**! I'm powered by intelligent multi-provider routing.\n\nTry asking me to:\n- Write code in any language\n- Analyze data or documents\n- Explain complex concepts\n- Debug your applications\n\nI route to the best model for each task automatically.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [currentProvider, setCurrentProvider] = useState('-');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [costEstimate, setCostEstimate] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);

  const scrollToBottom = useCallback((force = false) => {
    if (force) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      return;
    }
    const container = chatContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    // Auto-scroll if user is near bottom
    if (scrollHeight - scrollTop - clientHeight < 200) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 300);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);
    setInput('');
    setIsStreaming(true);
    setShowSuggestions(false);
    setCurrentProvider('Routing...');
    setTokensUsed(0);
    setCostEstimate(0);
    startTimeRef.current = Date.now();

    // Auto-resize textarea
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const allMessages = [...messages, userMessage];

    abortControllerRef.current = await chatStream(
      allMessages,
      selectedModel === 'auto' ? undefined : selectedModel,
      {
        onToken: (token) => {
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = {
              role: 'assistant',
              content: next[next.length - 1].content + token,
            };
            return next;
          });
        },
        onDone: () => {
          setIsStreaming(false);
          setCurrentProvider('Complete');
          setResponseTime((Date.now() - startTimeRef.current) / 1000);
        },
        onError: (error) => {
          setIsStreaming(false);
          setCurrentProvider('Error');
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = {
              role: 'assistant',
              content: `❌ **Error:** ${error.message}\n\nPlease try again or select a different model.`,
            };
            return next;
          });
        },
        onModel: (model) => {
          setCurrentProvider(model.split('/')[0] || model);
        },
        onUsage: (tokens, cost) => {
          setTokensUsed(tokens);
          setCostEstimate(cost);
        },
      }
    );
  }, [input, isStreaming, messages, selectedModel]);

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setCurrentProvider('Stopped');
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: `👋 Chat cleared! How can I help you today?`,
      },
    ]);
    setShowSuggestions(true);
    setTokensUsed(0);
    setCostEstimate(0);
    setResponseTime(0);
    setCurrentProvider('-');
  }, []);

  const copyMessage = useCallback(async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }, [handleSubmit]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const selectedModelLabel = AVAILABLE_MODELS.find(m => m.value === selectedModel)?.label || 'Auto';

  return (
    <div className="flex h-full">
      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-void-400/20 bg-void-100/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h1 className="text-sm font-semibold text-white">Agent Chat</h1>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-void-300/50 border border-void-400/20">
              <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-void-400'}`} />
              <span className="text-xs text-muted-foreground font-mono">{isStreaming ? 'Streaming' : 'Ready'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-void-300/50 border border-void-400/20 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span className="hidden sm:inline max-w-[150px] truncate">{selectedModelLabel}</span>
                <span className="sm:hidden">Model</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showModelSelector && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowModelSelector(false)} />
                  <div className="absolute right-0 top-full mt-1 w-72 bg-void-200 border border-void-400/30 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-void-400/20">
                      <p className="text-xs font-medium text-muted-foreground">Select Model</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                      {MODEL_GROUPS.map((group) =>
                        group.models.length > 0 ? (
                          <div key={group.label}>
                            <div className="px-4 py-1.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                                {group.label}
                              </span>
                            </div>
                            {group.models.map((model) => (
                              <button
                                key={model.value}
                                onClick={() => {
                                  setSelectedModel(model.value);
                                  setShowModelSelector(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-void-300/50 ${
                                  selectedModel === model.value ? 'bg-emerald-500/10 text-emerald-400' : 'text-foreground'
                                }`}
                              >
                                <span className="flex-1 text-left">{model.label}</span>
                                {selectedModel === model.value && (
                                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </button>
                            ))}
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Clear button */}
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-void-300 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scrollbar-thin"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 mb-6 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : ''}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                {/* Message bubble */}
                <div className={`group max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-emerald-500/15 border border-emerald-500/25 rounded-tr-none'
                        : 'bg-void-200/60 border border-void-400/20 rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div
                        className="message-content text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: msg.content
                            .replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
                              const escaped = code
                                .replace(/&/g, '&amp;')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;');
                              return `<pre><code class="language-${lang || 'text'}">${escaped}</code></pre>`;
                            })
                            .replace(/`([^`]+)`/g, '<code>$1</code>')
                            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                            .replace(/^- (.+)$/gm, '<li>$1</li>')
                            .replace(/\n\n/g, '</p><p>')
                            .replace(/\n/g, '<br/>'),
                        }}
                      />
                    ) : (
                      <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>

                  {/* Copy button */}
                  {msg.role === 'assistant' && msg.content && !isStreaming && (
                    <div className="flex items-center gap-2 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyMessage(msg.content, i)}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedIndex === i ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* User avatar */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-void-400/30 border border-void-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Streaming indicator */}
            {isStreaming && (
              <div className="flex items-center gap-2 px-2 mb-4 animate-fade-in-up">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" style={{ animationDelay: '400ms' }} />
                </div>
                <span className="text-xs text-muted-foreground font-mono">Generating response...</span>
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && messages.length === 1 && (
              <div className="mt-6 animate-fade-in-up">
                <p className="text-xs font-medium text-muted-foreground mb-3">Suggestions</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTIONS.map((suggestion, i) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setInput(suggestion.text);
                          inputRef.current?.focus();
                        }}
                        className="flex items-start gap-3 px-4 py-3 rounded-xl bg-void-200/50 border border-void-400/20 hover:border-emerald-500/30 hover:bg-void-200/80 transition-all duration-200 text-left group"
                      >
                        <Icon className="w-4 h-4 text-emerald-400/70 mt-0.5 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          {suggestion.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom(true)}
            className="absolute bottom-24 right-8 p-2 rounded-full bg-void-300 border border-void-400/30 text-muted-foreground hover:text-foreground shadow-lg transition-all hover:scale-105"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}

        {/* Input area */}
        <div className="border-t border-void-400/20 bg-void-100/50 backdrop-blur-md">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 py-1.5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                <Cpu className="w-3 h-3" />
                <span>{currentProvider}</span>
              </div>
              {tokensUsed > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{responseTime.toFixed(1)}s</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
              {tokensUsed > 0 && (
                <>
                  <span>~{tokensUsed} tokens</span>
                  <span>${costEstimate.toFixed(4)}</span>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isStreaming ? 'Waiting for response...' : 'Type a message... (Shift+Enter for new line)'}
                  className="w-full px-4 py-3 pr-10 text-sm text-foreground bg-void-200 border border-void-400/30 rounded-xl resize-none min-h-[48px] max-h-[200px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                  disabled={isStreaming}
                  rows={1}
                  aria-label="Chat input"
                />
              </div>
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  className="flex items-center gap-2 px-4 py-3 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/25 transition-colors"
                  aria-label="Stop streaming"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/25 hover:border-emerald-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">Send</span>
                </button>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
              Opsora AI Agent routes to the best model for each task. Responses are AI-generated.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}