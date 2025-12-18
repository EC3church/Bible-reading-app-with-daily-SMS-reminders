export async function handler() {
  const apiKey = process.env.MTA_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Missing MTA_API_KEY" }),
    };
  }

  const message =
    "📖 Bible in a Year — Today’s Reading\n\nOpen the app to see today’s scripture and audio.";

  const response = await fetch("https://api.mobile-text-alerts.com/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      message,
      groupIds: [288518], // ✅ ONLY this group receives the text
    }),
  });

  const data = await response.json().catch(() => ({}));

  return {
    statusCode: response.ok ? 200 : response.status,
    body: JSON.stringify({ ok: response.ok, data }),
  };
}
