const MAX_BODY_BYTES = 12_000;

const FIELD_LIMITS = {
  name: 120,
  business: 160,
  phone: 60,
  need: 1500,
  country: 80,
  language: 20,
  source: 80
} as const;

type LeadField = keyof typeof FIELD_LIMITS;

type LeadPayload = {
  name: string;
  business: string;
  phone: string;
  need: string;
  country: string;
  language: string;
  source: string;
};

function jsonError(error: string, status: number, fields?: string[]) {
  return Response.json(
    { ok: false, error, ...(fields ? { fields } : {}) },
    { status }
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function sanitizeString(value: unknown, maxLength: number) {
  if (value === null || value === undefined) {
    return "";
  }

  if (!["string", "number", "boolean"].includes(typeof value)) {
    return "";
  }

  return String(value)
    .replace(/\u0000/g, "")
    .replace(/[ \t\r\n]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanField(body: Record<string, unknown>, field: LeadField) {
  return sanitizeString(body[field], FIELD_LIMITS[field]);
}

function buildLeadPayload(body: Record<string, unknown>) {
  const payload: LeadPayload = {
    name: cleanField(body, "name"),
    business: cleanField(body, "business"),
    phone: cleanField(body, "phone"),
    need: cleanField(body, "need"),
    country: cleanField(body, "country") || "Indonesia",
    language: cleanField(body, "language") || "id",
    source: cleanField(body, "source") || "opsora-landing"
  };

  const missing = (["name", "business", "need"] as const).filter(
    (field) => !payload[field]
  );

  return { payload, missing };
}

function pickSafeUpstreamResponse(data: unknown) {
  const record = asRecord(data);
  if (!record) {
    return { ok: true };
  }

  const reply = sanitizeString(record.reply, 3000);
  const id = sanitizeString(record.id, 120);

  return {
    ok: true,
    ...(reply ? { reply } : {}),
    ...(id ? { id } : {})
  };
}

export async function POST(req: Request) {
  const webhookUrl = process.env.OPSORA_WEBHOOK_URL;
  const token = process.env.OPSORA_LEAD_API_TOKEN;

  if (!webhookUrl || !token) {
    return jsonError("server_not_configured", 500);
  }

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonError("payload_too_large", 413);
  }

  let raw = "";
  try {
    raw = await req.text();
  } catch {
    return jsonError("invalid_request_body", 400);
  }

  if (raw.length > MAX_BODY_BYTES) {
    return jsonError("payload_too_large", 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return jsonError("invalid_json", 400);
  }

  const body = asRecord(parsed);
  if (!body) {
    return jsonError("invalid_payload", 400);
  }

  const { payload, missing } = buildLeadPayload(body);
  if (missing.length > 0) {
    return jsonError("validation_failed", 400, missing);
  }

  let upstream: Response;
  try {
    upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Opsora-Token": token
      },
      body: JSON.stringify(payload)
    });
  } catch {
    return jsonError("lead_submit_failed", 502);
  }

  const data = await upstream.json().catch(() => null);
  if (!upstream.ok) {
    return jsonError("lead_submit_failed", 502);
  }

  return Response.json(pickSafeUpstreamResponse(data), { status: 200 });
}
