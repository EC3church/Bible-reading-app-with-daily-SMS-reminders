export async function handler(event) {
  const to = (event.queryStringParameters?.to || "").trim();

  // SAFETY: if no phone number is provided, do NOT send to anyone.
  if (!to) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        sent: false,
        reason: "No ?to= provided. Nothing sent (safe mode).",
        example: "?to=+13105551234",
      }),
    };
  }

  const apiKey = process.env.MTA_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Missing MTA_API_KEY" }) };
  }

  const message = "TEST ✅ Bible in a Year: your daily reading reminder is working.";

  const resp = await fetch("https://api.mobile-text-alerts.com/v3/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      // Optional but recommended to prevent accidental duplicates if you retry:
      "X-Request-Id": `bible-${Date.now()}`,
    },
    body: JSON.stringify({
      subscribers: [to],   // <-- send to ONE phone number
      message,
    }),
  });

  const data = await resp.json().catch(() => ({}));
  return { statusCode: resp.ok ? 200 : resp.status, body: JSON.stringify({ ok: resp.ok, data }) };
}
