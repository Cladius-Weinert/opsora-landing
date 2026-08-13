'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Settings,
  Key,
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Cpu,
  Github,
  Twitter,
  Mail,
  Loader2,
  Bot,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

const API_KEYS = [
  { name: 'Default Key', key: 'ops_sk_xxxxxxxxxxxx...xxxx', created: '2024-12-01', lastUsed: '2 min ago' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);

  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account, API keys, and preferences.
          </p>
        </div>

        {/* Profile Section */}
        <div className="stat-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Profile</h3>
              <p className="text-xs text-muted-foreground">Your account information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm text-foreground font-mono">{user?.email || 'demo@opsora.ai'}</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-sm text-foreground font-mono">{user?.id?.slice(0, 12) || 'demo_user'}</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="badge-success">Free Tier</span>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Key className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">API Keys</h3>
                <p className="text-xs text-muted-foreground">Manage your API access tokens</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewKey(!showNewKey)}
              className="btn-primary text-xs px-4 py-2"
            >
              + New Key
            </button>
          </div>

          {showNewKey && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-400 mb-2">✨ New API Key Created</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-void-300 text-sm font-mono text-foreground">
                  ops_sk_new_key_xxxxxxxxxxxxxxxxxxxx
                </code>
                <button
                  onClick={() => copyKey('ops_sk_new_key_xxxxxxxxxxxxxxxxxxxx')}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedKey === 'ops_sk_new_key_xxxxxxxxxxxxxxxxxxxx' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Make sure to copy this key now. You won't be able to see it again.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {API_KEYS.map((apiKey) => (
              <div
                key={apiKey.name}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50 hover:bg-void-300/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{apiKey.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{apiKey.key}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    Used {apiKey.lastUsed}
                  </span>
                  <button
                    onClick={() => copyKey(apiKey.key)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    title="Copy key"
                  >
                    {copiedKey === apiKey.key ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-void-400/20">
            <p className="text-xs text-muted-foreground">
              API keys are used to authenticate requests to the Opsora Gateway. Use the{' '}
              <code className="text-emerald-400 bg-void-300 px-1 py-0.5 rounded">Authorization: Bearer</code> header.
            </p>
          </div>
        </div>

        {/* Model Preferences */}
        <div className="stat-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Model Preferences</h3>
              <p className="text-xs text-muted-foreground">Default model and routing behavior</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50">
              <span className="text-sm text-muted-foreground">Default Model</span>
              <span className="text-sm text-foreground font-mono">Auto (Smart Routing)</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50">
              <span className="text-sm text-muted-foreground">Fallback Strategy</span>
              <span className="text-sm text-foreground font-mono">Circuit Breaker → Next Best</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50">
              <span className="text-sm text-muted-foreground">Streaming</span>
              <span className="text-sm text-foreground font-mono">Enabled</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="stat-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Resources</h3>
              <p className="text-xs text-muted-foreground">Useful links and documentation</p>
            </div>
          </div>
          <div className="space-y-2">
            <a
              href="https://github.com/Cladius-Weinert/opsora-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50 hover:bg-void-300/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">GitHub Repository</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
            <a
              href="https://opsora-landing-zeta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50 hover:bg-void-300/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Opsora Landing Page</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
            <a
              href="https://opsora-agent-api.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-3 px-4 rounded-xl bg-void-300/50 hover:bg-void-300/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Agent API</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}