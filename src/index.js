// Worker entrypoint for `meds`.
// Exposes a small JSON API backed by the D1 binding `DB`, and
// falls back to the static assets bound as `ASSETS` for everything else.

export default {
    async fetch(request, env, ctx) {
          const url = new URL(request.url);

      // Simple health check
      if (url.pathname === "/api/health") {
              return Response.json({ ok: true, ts: Date.now() });
      }

      // Example: list rows from a `meds` table if it exists.
      // Replace the SQL below with your real schema/query.
      if (url.pathname === "/api/meds") {
              try {
                        const { results } = await env.DB.prepare(
                                    "SELECT name FROM sqlite_schema WHERE type = 'table' ORDER BY name"
                                  ).all();
                        return Response.json({ tables: results });
              } catch (err) {
                        return new Response(
                                    JSON.stringify({ error: err.message }),
                          { status: 500, headers: { "content-type": "application/json" } }
                                  );
              }
      }

      // Everything else: serve static assets (index.html, etc.)
      return env.ASSETS.fetch(request);
    },
};
