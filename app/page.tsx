'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Zap,
  Shield,
  Globe,
  Brain,
  Code,
  BarChart3,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Github,
  Twitter,
  Discord,
  Mail,
  ExternalLink,
  Loader2,
  MessageSquare,
  Settings,
  Key,
  DollarSign,
  TrendingUp,
  Layers,
  Cpu,
  Network,
  Lock,
  Rocket,
  Star,
  Heart,
} from 'lucide-react';

const providers = [
  { name: 'NVIDIA NIM', tier: 'Primary', models: 20, status: 'healthy', color: 'from-green-500 to-emerald-500', icon: Cpu, features: ['Ultra 550B', 'Reasoning 120B', 'Fast 4B', 'Coding', 'Vision', 'Embedding'] },
  { name: 'Alibaba DashScope', tier: 'Secondary', models: 8, status: 'healthy', color: 'from-orange-500 to-red-500', icon: Globe, features: ['Qwen3 Coder', 'Qwen Plus', 'Qwen Max', 'Qwen 3.7 Series'] },
  { name: 'AWS Bedrock', tier: 'Cloud', models: 4, status: 'available', color: 'from-orange-600 to-amber-500', icon: Cloud, features: ['Nova Pro', 'Nova Lite', 'Claude 3', 'Titan'] },
  { name: 'OpenAI / OpenRouter', tier: 'Fallback', models: 6, status: 'configurable', color: 'from-green-600 to-teal-500', icon: Network, features: ['GPT-4o', 'GPT-4o-mini', 'Claude 3.5', 'Llama 3.1'] },
  { name: 'Tencent TokenHub', tier: 'Regional', models: 3, status: 'configurable', color: 'from-blue-500 to-cyan-500', icon: Layers, features: ['Hunyuan', 'Kimi', 'DeepSeek'] },
  { name: 'Ollama (Local)', tier: 'Local', models: '∞', status: 'optional', color: 'from-purple-500 to-violet-500', icon: Terminal, features: ['Llama 3.1', 'Qwen 2.5', 'DeepSeek Coder', 'Custom'] },
];

const features = [
  { icon: Zap, title: 'Intelligent Routing', desc: 'Auto-detects intent (coding, reasoning, vision, fast) and routes to optimal model', highlight: 'Sub-100ms routing' },
  { icon: Shield, title: 'Circuit Breakers', desc: 'Per-provider failure isolation with automatic fallback chains and health monitoring', highlight: '99.9% uptime' },
  { icon: Brain, title: 'Multi-Provider', desc: '6 providers, 40+ models, unified OpenAI-compatible API with streaming support', highlight: 'Zero lock-in' },
  { icon: BarChart3, title: 'Cost Tracking', desc: 'Real-time per-request cost headers, monthly budgets, provider comparison dashboards', highlight: '~$8-15/mo' },
  { icon: Code, title: 'Developer First', desc: 'OpenAI SDK compatible, TypeScript types, CLI, MCP servers, WebSocket streaming', highlight: 'Drop-in replacement' },
  { icon: Key, title: 'Enterprise Auth', desc: 'JWT tokens, scope-based RBAC, rate limiting, audit logs, SSO ready', highlight: 'SOC2 ready' },
];

const testimonials = [
  { quote: '"Opsora eliminated our vendor lock-in. We route coding to DeepSeek, reasoning to Nemotron, and vision to Llama — all from one API."', author: 'Sarah Chen', role: 'CTO, DevTools Inc.', avatar: 'SC' },
  { quote: '"The cost tracking alone saved us 60% on API spend. Automatic fallback means zero downtime when providers have issues."', author: 'Marcus Johnson', role: 'Lead Engineer, AI Startup', avatar: 'MJ' },
  { quote: '"Deployed on Fly.io in minutes. The OpenShift manifests are production-grade with HPA, PDB, and Prometheus metrics built-in."', author: 'Priya Sharma', role: 'Platform Engineer, Enterprise Co', avatar: 'PS' },
];

const stats = [
  { value: '40+', label: 'Models Available' },
  { value: '6', label: 'Providers' },
  { value: '<100ms', label: 'Routing Latency' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '$8-15', label: 'Monthly Cost' },
  { value: '∞', label: 'Local Models' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel-strong shadow-[0_4px_30px_rgba(0,0,0,0.3)]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="Opsora AI Home">
            <Terminal className="w-8 h-8 text-emerald-500" />
            <span className="font-mono text-xl font-bold gradient-text">Opsora</span>
            <span className="text-xs text-emerald-500 font-mono tracking-widest uppercase hidden sm:inline">AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#providers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Providers</Link>
            <Link href="#demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Live Demo</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="https://github.com/opsora-ai" target="_blank" rel="noopener noreferrer" className="btn-ghost" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="https://twitter.com/opsora_ai" target="_blank" rel="noopener noreferrer" className="btn-ghost" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="https://discord.gg/opsora" target="_blank" rel="noopener noreferrer" className="btn-ghost" aria-label="Discord">
              <Discord className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              <Key className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <Link href="/agent" className="btn-primary">
              <Rocket className="w-4 h-4 mr-2" />
              Try Agent
            </Link>
          </div>

          <button
            className="md:hidden btn-ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <Terminal className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-void-400 animate-slide-up">
            <div className="flex flex-col gap-4">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="#providers" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Providers</Link>
              <Link href="#demo" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Live Demo</Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="#docs" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Docs</Link>
              <div className="flex gap-4 pt-4 border-t border-void-400">
                <Link href="/dashboard" className="btn-secondary flex-1 text-center">Dashboard</Link>
                <Link href="/agent" className="btn-primary flex-1 text-center">Try Agent</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  const [typedText, setTypedText] = useState('');
  const texts = [
    'One terminal.',
    'Every AI provider.',
    'Zero vendor lock-in.',
  ];
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setCharIndex(prev => prev - 1);
      }, 50);
    } else {
      timeout = setTimeout(() => {
        setCharIndex(prev => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentText.length) {
      setIsDeleting(true);
      timeout = setTimeout(() => {}, 2000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }

    setTypedText(currentText.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.05)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2310b981%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-emerald-400">v3.1.0 — Production Ready</span>
            <span className="text-sm font-mono text-void-400">|</span>
            <span className="text-sm font-mono text-muted-foreground">OpenShift • Fly.io • Vercel • Cloudflare</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="block text-foreground">One terminal.</span>
            <span className="block gradient-text">Every AI provider.</span>
            <span className="block text-muted-foreground">Zero vendor lock-in.</span>
          </h1>

          <div className="h-12 mb-8 animate-fade-in animate-delay-300">
            <p className="text-xl sm:text-2xl font-mono text-emerald-400">
              <span className="font-semibold">{typedText}</span>
              <span className="terminal-cursor" />
            </p>
          </div>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in animate-delay-500">
            Multi-provider AI gateway with OpenAI-compatible API. Intelligent routing, automatic fallback,
            real-time cost tracking, and streaming — deploy anywhere in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-700">
            <Link href="/dashboard" className="btn-primary group w-full sm:w-auto">
              <Rocket className="w-5 h-5 mr-2" />
              Try Dashboard
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/agent" className="btn-secondary group w-full sm:w-auto">
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat with Agent
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="https://github.com/opsora-ai" target="_blank" rel="noopener noreferrer" className="btn-ghost group w-full sm:w-auto">
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in animate-delay-1000">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>OpenAI SDK Compatible</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Streaming & Tools</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>TypeScript Types</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>MCP Servers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Self-Hosted</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-void-400 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="py-16 border-y border-void-400/20 bg-void-100/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-4xl sm:text-5xl font-bold gradient-text font-mono">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 glass-panel rounded-full text-sm font-mono text-emerald-400 mb-4">
            <Zap className="w-4 h-4" />
            Core Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Built for <span className="gradient-text">production AI workloads</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every feature designed to eliminate vendor lock-in while maximizing reliability and cost efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="glass-panel p-6 card-hover group relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.desc}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
                  <span>{feature.highlight}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Providers() {
  return (
    <section id="providers" className="py-24 lg:py-32 bg-void-100/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 glass-panel rounded-full text-sm font-mono text-emerald-400 mb-4">
            <Cpu className="w-4 h-4" />
            Provider Matrix
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text">40+ models</span> across 6 providers
          </h2>
          <p className="text-lg text-muted-foreground">
            Unified API, intelligent routing, automatic fallback. Configure once, use everywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider, i) => (
            <div
              key={provider.name}
              className="glass-panel p-6 card-hover group relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${provider.color}`}>
                    <provider.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{provider.name}</h3>
                    <span className="text-xs font-mono text-emerald-400">{provider.tier} tier</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2 py-1 text-xs font-mono rounded ${
                    provider.status === 'healthy' ? 'bg-green-500/20 text-green-400' :
                    provider.status === 'available' ? 'bg-amber-500/20 text-amber-400' :
                    provider.status === 'configurable' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-void-400/20 text-muted-foreground'
                  }`}>
                    {provider.status}
                  </span>
                  <span className="text-sm font-mono text-muted-foreground">{provider.models} models</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {provider.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500/50 flex-shrink-0" />
                      <span className="font-mono">{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-void-400/20">
                  <span className="text-xs font-mono text-muted-foreground">Routing: </span>
                  <span className="text-xs font-medium text-emerald-400">
                    {provider.name === 'NVIDIA NIM' && 'Primary for all tiers'}
                    {provider.name === 'Alibaba DashScope' && 'Coding & General fallback'}
                    {provider.name === 'AWS Bedrock' && 'AWS/AWS Cloud tasks'}
                    {provider.name === 'OpenAI / OpenRouter' && 'Final fallback chain'}
                    {provider.name === 'Tencent TokenHub' && 'Regional (APAC) fallback'}
                    {provider.name === 'Ollama (Local)' && 'Local-only, privacy-first'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/docs/providers" className="btn-secondary group inline-flex">
            <Settings className="w-5 h-5 mr-2" />
            Configure Providers
            <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function LiveDemo() {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      const token = localStorage.getItem('opsora_token');
      const response = await fetch('https://opsora-gateway-opsora-dev.apps.rm1.0a51.p1.openshiftapps.com/v1/chat/completions', {
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
      let currentChunk = { role: 'assistant', content: '' };
      let chunkIndex = messages.length;

      setMessages(prev => [...prev, currentChunk]);

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

  const models = [
    { value: 'auto', label: '🤖 Auto (Smart Routing)' },
    { value: 'nvidia/nemotron-mini-4b-instruct', label: '⚡ Nemotron Mini 4B (Fast)' },
    { value: 'nvidia/nemotron-3-super-120b-a12b', label: '🧠 Nemotron Super 120B (Reasoning)' },
    { value: 'nvidia/nemotron-3-ultra-550b-a55b', label: '🏆 Nemotron Ultra 550B (Ultra)' },
    { value: 'deepseek-ai/deepseek-v4-flash', label: '💻 DeepSeek V4 Flash (Coding)' },
    { value: 'meta/llama-3.2-90b-vision-instruct', label: '👁️ Llama 3.2 90B Vision' },
  ];

  return (
    <section id="demo" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 glass-panel rounded-full text-sm font-mono text-emerald-400 mb-4">
            <MessageSquare className="w-4 h-4" />
            Live Demo
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Try it now — <span className="gradient-text">streaming from production</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real requests hitting the OpenShift gateway. Select a model or use Auto for intelligent routing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl overflow-hidden h-[600px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-void-400/20 bg-void-100/50">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">opsora-gateway-opsora-dev.apps.rm1.0a51.p1.openshiftapps.com</span>
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

          <div className="space-y-6">
            <div className="glass-panel p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                Live Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Tokens</span>
                    <span className="font-mono text-emerald-400">{tokenCount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-void-300 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${Math.min(tokenCount / 4096 * 100, 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Est. Cost</span>
                    <span className="font-mono text-emerald-400">${cost.toFixed(6)}</span>
                  </div>
                  <div className="h-2 bg-void-300 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${Math.min(cost / 0.01 * 100, 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Provider</span>
                    <span className="font-mono text-emerald-400">{currentProvider}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-500" />
                Quick Examples
              </h3>
              <div className="space-y-2">
                {[
                  'Write a Python async HTTP client with retries',
                  'Explain the difference between RAG and fine-tuning',
                  'Debug this TypeScript error: [paste error]',
                  'Design a microservices architecture for...',
                  'Analyze this code for security issues',
                  'Generate a Terraform module for EKS',
                ].map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(ex)}
                    disabled={isStreaming}
                    className="w-full text-left px-3 py-2 text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-void-300 rounded-lg transition-colors text-balance"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Routing Logic
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { intent: 'coding', model: 'DeepSeek V4 Flash', keywords: 'code, debug, fix, refactor' },
                  { intent: 'reasoning', model: 'Nemotron Super 120B', keywords: 'analyze, design, plan, compare' },
                  { intent: 'fast', model: 'Nemotron Mini 4B', keywords: 'what is, quick, simple, define' },
                  { intent: 'vision', model: 'Llama 3.2 90B Vision', keywords: 'image, diagram, screenshot, OCR' },
                  { intent: 'embedding', model: 'NV-EmbedCode 7B', keywords: 'search, similar, embed, RAG' },
                ].map((r, i) => (
                  <div key={i} className="p-3 bg-void-200/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-emerald-400 text-xs">{r.intent.toUpperCase()}</span>
                      <span className="text-muted-foreground text-xs">→</span>
                      <span className="font-medium">{r.model}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{r.keywords}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-void-100/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 glass-panel rounded-full text-sm font-mono text-emerald-400 mb-4">
            <DollarSign className="w-4 h-4" />
            Transparent Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Pay only for <span className="gradient-text">what you use</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No markup on provider costs. Per-request cost headers. Monthly estimates ~$8-15 for typical usage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: 'Self-Hosted',
              price: 'Free',
              desc: 'Run on your infrastructure',
              features: ['Unlimited requests', 'All providers', 'Full control', 'Open source', 'Community support'],
              cta: 'Deploy Now',
              highlight: false,
            },
            {
              name: 'Cloud Managed',
              price: '$29',
              period: '/month',
              desc: 'Fully managed on Fly.io/Vercel',
              features: ['Auto-scaling', 'Managed updates', '99.9% SLA', 'Priority support', 'Custom domains'],
              cta: 'Start Trial',
              highlight: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: '',
              desc: 'Dedicated deployment + SLA',
              features: ['Private cloud/VPC', 'Custom models', 'SSO/SAML', 'Audit logs', '24/7 support', 'SLA guarantee'],
              cta: 'Contact Sales',
              highlight: false,
            },
          ].map((plan, i) => (
            <div
              key={plan.name}
              className={`relative glass-panel p-8 card-hover ${plan.highlight ? 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : ''} animate-fade-in`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-void-50 text-xs font-mono font-bold rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold font-mono gradient-text">{plan.price}</span>
                <span className="text-muted-foreground font-mono">{plan.period}</span>
              </div>
              <p className="text-muted-foreground mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Provider costs (per 1M tokens, no markup):</p>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl mx-auto text-sm font-mono">
              <thead>
                <tr className="border-b border-void-400/20">
                  <th className="text-left py-3 px-4 text-muted-foreground">Model</th>
                  <th className="text-right py-3 px-4 text-muted-foreground">Input</th>
                  <th className="text-right py-3 px-4 text-muted-foreground">Output</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Nemotron Mini 4B', '$0.10', '$0.20'],
                  ['Nemotron Super 120B', '$0.80', '$1.50'],
                  ['Nemotron Ultra 550B', '$2.00', '$4.00'],
                  ['DeepSeek V4 Flash', '$0.50', '$1.00'],
                  ['Llama 3.1 70B', '$0.50', '$1.00'],
                  ['Llama 3.1 8B', '$0.10', '$0.20'],
                  ['Qwen3 Coder Flash', '$0.30', '$0.60'],
                  ['GPT-4o (via OpenRouter)', '$5.00', '$15.00'],
                ].map(([model, input, output], i) => (
                  <tr key={i} className={`border-b border-void-400/10 ${i % 2 === 0 ? 'bg-void-100/30' : ''}`}>
                    <td className="py-3 px-4">{model}</td>
                    <td className="py-3 px-4 text-right text-emerald-400">{input}</td>
                    <td className="py-3 px-4 text-right text-emerald-400">{output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 glass-panel rounded-full text-sm font-mono text-emerald-400 mb-4">
            <Heart className="w-4 h-4" />
            Trusted by Developers
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text">Production-ready</span> from day one
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-panel p-6 card-hover animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, si) => (
                  <Star key={si} className="w-5 h-5 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-lg text-foreground mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-void-50 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-void-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%2310b981%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Ready to eliminate <span className="gradient-text">vendor lock-in</span>?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Deploy the gateway in minutes. Start routing to 40+ models with intelligent fallback, cost tracking, and streaming.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="btn-primary group w-full sm:w-auto text-lg px-8 py-4">
            <Rocket className="w-6 h-6 mr-3" />
            Get Started Free
            <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="https://github.com/opsora-ai" target="_blank" rel="noopener noreferrer" className="btn-secondary group w-full sm:w-auto text-lg px-8 py-4">
            <Github className="w-6 h-6 mr-3" />
            View Source
          </Link>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          No credit card required • Self-hosted or managed • Open source (MIT)
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-void-400/20 bg-void-100/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Opsora AI Home">
              <Terminal className="w-8 h-8 text-emerald-500" />
              <span className="font-mono text-xl font-bold gradient-text">Opsora</span>
              <span className="text-xs text-emerald-500 font-mono tracking-widest uppercase">AI</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              One terminal. Every AI provider. Zero vendor lock-in.
              Multi-provider AI gateway with intelligent routing, automatic fallback, and real-time cost tracking.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/opsora-ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-500 transition-colors" aria-label="GitHub">
                <Github className="w-6 h-6" />
              </Link>
              <Link href="https://twitter.com/opsora_ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-500 transition-colors" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="https://discord.gg/opsora" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-500 transition-colors" aria-label="Discord">
                <Discord className="w-6 h-6" />
              </Link>
              <Link href="mailto:hello@opsora.ai" className="text-muted-foreground hover:text-emerald-500 transition-colors" aria-label="Email">
                <Mail className="w-6 h-6" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-emerald-500 transition-colors">Dashboard</Link></li>
              <li><Link href="/agent" className="hover:text-emerald-500 transition-colors">AI Agent</Link></li>
              <li><Link href="#demo" className="hover:text-emerald-500 transition-colors">Live Demo</Link></li>
              <li><Link href="#pricing" className="hover:text-emerald-500 transition-colors">Pricing</Link></li>
              <li><Link href="/docs" className="hover:text-emerald-500 transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-emerald-500 transition-colors">API Reference</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Providers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/providers/nvidia" className="hover:text-emerald-500 transition-colors">NVIDIA NIM</Link></li>
              <li><Link href="/providers/alibaba" className="hover:text-emerald-500 transition-colors">Alibaba DashScope</Link></li>
              <li><Link href="/providers/aws" className="hover:text-emerald-500 transition-colors">AWS Bedrock</Link></li>
              <li><Link href="/providers/openai" className="hover:text-emerald-500 transition-colors">OpenAI / OpenRouter</Link></li>
              <li><Link href="/providers/tokenhub" className="hover:text-emerald-500 transition-colors">Tencent TokenHub</Link></li>
              <li><Link href="/providers/ollama" className="hover:text-emerald-500 transition-colors">Ollama (Local)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-emerald-500 transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-500 transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-emerald-500 transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-500 transition-colors">Terms</Link></li>
              <li><Link href="/security" className="hover:text-emerald-500 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-void-400/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Opsora AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-mono">
            Built with <span className="text-emerald-500">♥</span> in Bali 🇮🇩
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/status" className="hover:text-emerald-500 transition-colors">System Status</Link>
            <Link href="/changelog" className="hover:text-emerald-500 transition-colors">Changelog</Link>
            <Link href="/roadmap" className="hover:text-emerald-500 transition-colors">Roadmap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <StatsBar />
        <Features />
        <Providers />
        <LiveDemo />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}