import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const apiKey = process.env.BATTLEMETRICS_API_KEY;
if (!apiKey) throw new Error("Missing BATTLEMETRICS_API_KEY Actions secret.");

const endpoint = new URL("https://battlemetrics.ru/api/v1/servers");
endpoint.search = new URLSearchParams({ game: "rust", sort: "players", per_page: "100", page: "1" }).toString();

const response = await fetch(endpoint, {
  headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
  signal: AbortSignal.timeout(20_000)
});

if (!response.ok) throw new Error(`BattleMetrics API returned HTTP ${response.status}.`);

const payload = await response.json();
if (!Array.isArray(payload.servers)) throw new Error("BattleMetrics API returned an unexpected response.");

const servers = payload.servers.map(server => ({
  id: server.id,
  name: server.name,
  address: server.address,
  country: server.country,
  online: server.online,
  players: server.players,
  max_players: server.max_players,
  map: server.map,
  url: server.url,
  last_wipe: server.last_wipe
}));

const outputPath = fileURLToPath(new URL("../data/servers.json", import.meta.url));
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ source: "BattleMetrics.ru", updatedAt: new Date().toISOString(), total: payload.total, servers }, null, 2)}\n`, "utf8");
console.log(`Fetched ${servers.length} of ${payload.total} Rust servers.`);
