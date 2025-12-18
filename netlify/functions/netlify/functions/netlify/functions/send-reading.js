export async function handler() {
  const apiKey = process.env.MTA_API_KEY;
  const longcodeId = Number(process.env.MTA_LONGCODE_ID); // <-- add this in your env vars

  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Missing MTA_API_KEY" }) };
  }
  if (!longcodeId) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Missing MTA_LONGCODE_ID" }) };
  }

  const message =
    "📖 Bible in a Year — Today’s Reading\n\nOpen the app to see today’s scripture and audio.";

  const response = await fetch("https://api.mobile-text-alerts.com/v3/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      longcodeId,
      message,
      groups: [288518],     // ✅ ONLY this group
      allSubscribers: false // ✅ extra safety (don’t blast everyone)
    }),
  });

  const data = await response.json().catch(() => ({}));

  return {
    statusCode: response.ok ? 200 : response.status,
    body: JSON.stringify({ ok: response.ok, data }),
  };
}
