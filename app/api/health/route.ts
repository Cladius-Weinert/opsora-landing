import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const CANONICAL_GATEWAY_URL = 'https://mwbgkkthwwlcndccnbnf.supabase.co/functions/v1/opsora-api';
const ALLOWED_ORIGINS = [
  'https://useopsora.com', 'https://www.useopsora.com', 'https://app.useopsora.com',
  'https://docs.useopsora.com', 'https://dashboard.useopsora.com', 'https://status.useopsora.com',
];

function corsHeaders(origin: string | null) {
  const isVercelPreview = origin?.endsWith('.vercel.app') ?? false;
  const isAllowed = !origin || ALLOWED_ORIGINS.includes(origin) || isVercelPreview;
  return {
    'Access-Control-Allow-Origin': isAllowed ? (origin || '*') : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', Vary: 'Origin',
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  let gatewayStatus = 'unknown';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${CANONICAL_GATEWAY_URL}/health`, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeout);
    gatewayStatus = res.ok ? 'reachable' : `http_${res.status}`;
  } catch { gatewayStatus = 'unreachable'; }

  const body = {
    status: gatewayStatus === 'reachable' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(), service: 'opsora-landing', version: '3.2.0',
    region: process.env.VERCEL_REGION || 'local', deploymentUrl: process.env.VERCEL_URL || 'local',
    gateway: { url: CANONICAL_GATEWAY_URL, status: gatewayStatus },
  };
  return NextResponse.json(body, {
    status: gatewayStatus === 'reachable' ? 200 : 503,
    headers: { ...corsHeaders(origin), 'Cache-Control': 'no-store, max-age=0' },
  });
}
