'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import {
  Bot,
  MessageSquare,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Cpu,
  User,
  Sparkles,
  Menu,
  X,
  ExternalLink,
  Activity,
  Terminal,
  Github,
  Twitter,
  Heart,
} from 'lucide-react';

const navItems = [
  { id: 'agent', label: 'Agent Chat', href: '/agent', icon: MessageSquare },
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      // Don't redirect on initial mount
    }
  }, [user, loading, mounted]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push('/');
  }, [signOut, router]);

  // If Supabase is not configured, show the content anyway
  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div className="flex h-screen overflow-hidden bg-void-50">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } flex-shrink-0 bg-void-100 border-r border-void-400/20 flex flex-col transition-all duration-300 z-50 ${
          mobileMenuOpen ? 'fixed inset-y-0 left-0 w-64' : 'hidden lg:flex'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-void-400/20">
          <Link href="/" className={`flex items-center gap-3 ${!sidebarOpen && 'lg:justify-center'}`}>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight">Opsora</span>
                <span className="text-[10px] text-emerald-400/70 font-mono">AI Agent</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-void-300 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  sidebarOpen ? '' : 'justify-center'
                } ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-void-300 border border-transparent'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-3 border-t border-void-400/20 space-y-1">
          {!sidebarOpen && (
            <div className="flex justify-center py-2">
              <div className="w-8 h-8 rounded-full bg-void-400/30 border border-void-400/20 flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}
          {sidebarOpen && (
            <div className="px-3 py-2.5 rounded-xl bg-void-300/50 border border-void-400/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-void-400/50 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.email?.split('@')[0] || 'Demo User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'demo@opsora.ai'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
            title={!sidebarOpen ? 'Sign Out' : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-void-400/20 bg-void-100/80 backdrop-blur-md">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-void-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-white">Opsora</span>
          </Link>
          <div className="w-9 h-9" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}