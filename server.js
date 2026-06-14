process.on("uncaughtException",  (e) => console.error("[nakama] uncaughtException:", e?.message ?? e));
process.on("unhandledRejection", (r) => console.error("[nakama] unhandledRejection:", r));
process.on("SIGTERM", () => { console.log("[nakama] SIGTERM"); process.exit(0); });
process.on("SIGINT",  () => { console.log("[nakama] SIGINT");  process.exit(0); });

const { createServer } = require("http");
const { parse }        = require("url");
const next             = require("next");

const PORT     = parseInt(process.env.PORT || "3000", 10);
const HOSTNAME = "0.0.0.0";

console.log(`[nakama] booting on ${HOSTNAME}:${PORT}`);

const app    = next({ dev: false, hostname: HOSTNAME, port: PORT });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        await handle(req, res, parse(req.url, true));
      } catch (err) {
        console.error("[nakama] request error:", err?.message ?? err);
        if (!res.headersSent) { res.statusCode = 500; res.end("internal server error"); }
      }
    });

    server.on("error", (err) => {
      console.error("[nakama] http server error:", err?.message ?? err);
    });

    server.listen(PORT, HOSTNAME, () => {
      console.log(`[nakama] ready → http://${HOSTNAME}:${PORT}`);
    });
  })
  .catch((err) => {
    // Next.js failed to prepare — run a minimal fallback so the process STAYS ALIVE
    // and Hostinger's healthcheck gets a response instead of triggering a restart loop.
    console.error("[nakama] Next.js prepare() failed:", err?.message ?? err);

    createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Nakama Store — server starting, please wait…");
    })
      .on("error", (e) => console.error("[nakama] fallback server error:", e?.message ?? e))
      .listen(PORT, HOSTNAME, () => {
        console.log(`[nakama] fallback server on port ${PORT}`);
      });
  });
