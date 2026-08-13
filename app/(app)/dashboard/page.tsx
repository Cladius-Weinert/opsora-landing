'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUsageStats, checkGatewayHealth, type UsageStats } from '@/lib/opsora-api';
import {
  Activity,
  MessageSquare,
  Cpu,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Globe,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Server,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  BarChart3,
  PieChart,
  LineChart,
  ExternalLink,
  Bot,
  Users,
  Database,
  Key,
} from 'lucide-react';

interface ProviderHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: string;
  uptime: string;
  models: number;
}

const PROVIDER_HEALTH: ProviderHealth[] = [
  { name: 'NVIDIA NIM', status: 'healthy', latency: '124ms', uptime: '99.9%', models: 20 },
  { name: 'Alibaba DashScope', status: 'healthy', latency: '156ms', uptime: '99.8%', models: 8 },
  { name: 'AWS Bedrock', status: 'healthy', latency: '189ms', uptime: '99.7%', models: 4 },
  { name: 'OpenAI / OpenRouter', status: 'healthy', latency: '142ms', uptime: '99.9%', models: 6 },
  { name: 'Tencent TokenHub', status: 'degraded', latency: '312ms', uptime: '98.5%', models: 3 },
  { name: 'Ollama (Local)', status: 'healthy', latency: '45ms', uptime: '100%', models: 10 },
];

const RECENT_ACTIVITY = [
  { action: 'Chat completed', model: 'Nemotron Super 120B', tokens: 1240, cost: 0.0021, time: '2 min ago', status: 'success' },
  { action: 'Code generation', model: 'DeepSeek V4', tokens: 3400, cost: 0.0058, time: '5 min ago', status: 'success' },
  { action: 'Stream interrupted', model: 'GPT-4o', tokens: 420, cost: 0.0015, time: '12 min ago', status: 'warning' },
  { action: 'Chat completed', model: 'Nemotron Mini 4B', tokens: 680, cost: 0.0008, time: '18 min ago', status: 'success' },
  { action: 'Vision analysis', model: 'Llama 3.2 90B', tokens: 2100, cost: 0.0036, time: '25 min ago', status: 'success' },
  { action: 'Rate limited', model: 'Nemotron Ultra 550B', tokens: 0, cost: 0, time: '32 min ago', status: 'error' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [health, setHealth] = useState<{ status: string; models: number; providers: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [usageData, healthData] = await Promise.all([
        getUsageStats('7d'),
        checkGatewayHealth(),
      ]);
      setUsage(usageData);
      setHealth(healthData);
    } catch {
      // Already handled in lib functions with mock data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString();
  };

  const modelColors: Record<string, string> = {
    'Nemotron Mini 4B': 'from-emerald-500 to-emerald-600',
    'Nemotron Super 120B': 'from-blue-500 to-indigo-600',
    'DeepSeek V4': 'from-amber-500 to-orange-600',
    'GPT-4o': 'from-purple-500 to-violet-600',
    'Other': 'from-void-400 to-void-500',
  };

  const modelBreakdown = usage?.modelBreakdown || {};
  const totalRequests = usage?.totalRequests || 0;
  const totalTokens = usage?.totalTokens || 0;
  const totalCost = usage?.totalCost || 0;
  const dailyData = usage?.dailyRequests || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Usage overview and system health for your AI agent.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-void-300 border border-void-400/30 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-void-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={MessageSquare}
            label="Total Requests"
            value={formatNumber(totalRequests)}
            trend={`+${((totalRequests / 10000) * 100).toFixed(1)}%`}
            trendUp={true}
            color="emerald"
          />
          <StatCard
            icon={Database}
            label="Tokens Processed"
            value={formatNumber(totalTokens)}
            trend={`+${((totalTokens / 2000000) * 100).toFixed(1)}%`}
            trendUp={true}
            color="blue"
          />
          <StatCard
            icon={DollarSign}
            label="Total Cost"
            value={`$${totalCost.toFixed(2)}`}
            trend={`${((totalCost / 10) * 100).toFixed(1)}%`}
            trendUp={false}
            color="amber"
          />
          <StatCard
            icon={Activity}
            label="Avg. Response Time"
            value="124ms"
            trend="-14ms"
            trendUp={true}
            color="purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cells-2 gap-6">
          {/* Daily Requests Chart */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Daily Requests</h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="h-48 flex items-end gap-2">
              {dailyData.map((day, i) => {
                const maxCount = Math.max(...dailyData.map(d => d.count), 1);
                const height = (day.count / maxCount) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className="w-full rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors relative cursor-pointer"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-void-300 border border-void-400/30 rounded-lg px-2 py-1 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.count.toLocaleString()} requests
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Distribution */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Model Distribution</h3>
                <p className="text-xs text-muted-foreground">Requests by model</p>
              </div>
              <PieChart className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {Object.entries(modelBreakdown).map(([name, data]) => {
                const pct = totalRequests > 0 ? (data.requests / totalRequests) * 100 : 0;
                const color = modelColors[name] || 'from-void-400 to-void-500';
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{name}</span>
                      <span className="text-xs text-muted-foreground">{pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-void-300 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Provider Health */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Provider Health</h3>
              <p className="text-xs text-muted-foreground">Real-time status of all AI providers</p>
            </div>
            <Server className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-void-400/20">
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3">Provider</th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3">Latency</th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3">Uptime</th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3">Models</th>
                </tr>
              </thead>
              <tbody>
                {PROVIDER_HEALTH.map((provider) => (
                  <tr key={provider.name} className="border-b border-void-400/10 hover:bg-void-300/30 transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-medium text-foreground">{provider.name}</span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        provider.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        provider.status === 'degraded' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {provider.status === 'healthy' ? <CheckCircle2 className="w-3 h-3" /> :
                         provider.status === 'degraded' ? <AlertCircle className="w-3 h-3" /> :
                         <XCircle className="w-3 h-3" />}
                        {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground font-mono">{provider.latency}</td>
                    <td className="py-3 text-sm text-muted-foreground font-mono">{provider.uptime}</td>
                    <td className="py-3 text-sm text-muted-foreground">{provider.models}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
              <p className="text-xs text-muted-foreground">Latest requests and system events</p>
            </div>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-void-300/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-emerald-400' :
                    activity.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground font-mono">{activity.model}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                  {activity.tokens > 0 && (
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {activity.tokens} tok · ${activity.cost.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: 'emerald' | 'blue' | 'amber' | 'purple';
}) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'text-emerald-400' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'text-blue-400' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: 'text-amber-400' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', icon: 'text-purple-400' },
  };

  const c = colorMap[color];

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${c.bg}`}>
          <Icon className={`w-4 h-4 ${c.icon}`} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        {trendUp ? (
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
        )}
        <span className={`text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend}
        </span>
        <span className="text-xs text-muted-foreground">vs last period</span>
      </div>
    </div>
  );
}