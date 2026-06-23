export async function POST(req: Request) {
  try {
    const webhookUrl = process.env.OPSORA_WEBHOOK_URL;
    const token = process.env.OPSORA_LEAD_API_TOKEN;

    if (!webhookUrl || !token) {
      return Response.json(
        { ok: false, error: "server_not_configured" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Opsora-Token": token
      },
      body: JSON.stringify({
        ...body,
        source: body.source || "opsora-landing"
      })
    });

    const data = await upstream.json().catch(() => ({
      ok: false,
      error: "invalid_upstream_response"
    }));

    return Response.json(data, { status: upstream.status });
  } catch {
    return Response.json(
      { ok: false, error: "lead_submit_failed" },
      { status: 500 }
    );
  }
}
