export default async () => {
  try {
    const response = await fetch("https://api.mobile-text-alerts.com/v3/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MTA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allSubscribers: true,
        message: "TEST: Message sent from Netlify successfully ✅",
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify({ ok: response.ok, data }), {
      status: response.ok ? 200 : response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

