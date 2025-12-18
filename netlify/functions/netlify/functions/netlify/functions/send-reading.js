export async function handler(event) {
  try {
    // 1) Get the phone number from the URL: ?to=+15551234567
    const to = (event.queryStringParameters?.to || "").trim();
    if (!to) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          error:
            "Missing ?to=. Example: ?to=+15551234567 (include country code).",
        }),
      };
    }

    // 2) Your MTA key is already saved in Netlify as an environment variable
    const apiKey = process.env.MTA_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: "Missing MTA_API_KEY in Netlify environment variables.",
        }),
      };
    }

    // 3) The message you want to send (simple test message)
    const message = "TEST: Your Bible reading reminder is working ✅";

    // 4) Call Mobile Text Alerts (this endpoint name may vary by MTA account)
    // IMPORTANT: If your MTA docs show a different URL, use that one.
    const resp = await fetch("https://app.mobile-text-alerts.com/api/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to,        // one phone number
        message,   // the text to send
      }),
    });

    const data = await resp.json().catch(() => ({}));

    return {
      statusCode: resp.ok ? 200 : resp.status,
      body: JSON.stringify({ ok: resp.ok, data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: String(err?.message || err) }),
    };
  }
}
