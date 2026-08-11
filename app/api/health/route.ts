import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Allowed origins for CORS — restrict in production if needed
const ALLOWED_ORIGINS = [
  'https://opsora.ai',
  'https://www.opsora.ai',
  'https://opsora-landing.vercel.app',
  'https://opsora-landing-zeta.vercel.app',
  'https://opsora-gateway.opsora-ai.workers.dev',
  'https://opsora-gateway-opsora-dev.apps.rm1.0a51.p1.openshiftapps.com',
];

function corsHeaders(origin: string | null) {
  // Allow all Vercel preview deployments + explicit list
  const isVercelPreview = origin?.endsWith('.vercel.app') ?? false;
  const isAllowed = !origin || ALLOWED_ORIGINS.includes(origin) || isVercelPreview;
  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin || '*') : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const gatewayUrl =
    process.env.NEXT_PUBLIC_API_URL || 'https://opsora-gateway.opsora-ai.workers.dev';

  // Optional: quick gateway reachability check (non-blocking, timeout 2s)
  let gatewayStatus: string = 'unknown';
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${gatewayUrl}/health`, { signal: controller.signal });
    clearTimeout(t);
    gatewayStatus = res.ok ? 'reachable' : `http_${res.status}`;
  } catch {
    gatewayStatus = 'unreachable';
  }

  const body = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'opsora-landing',
    version: '3.1.0',
    region: (process.env.VERCEL_REGION as string) || 'local',
    deploymentUrl: process.env.VERCEL_URL || 'local',
    gateway: {
      url: gatewayUrl,
      status: gatewayStatus,
    },
  };

  return NextResponse.json(body, {
    headers: {
      ...corsHeaders(origin),
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
