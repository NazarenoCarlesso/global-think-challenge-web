import { fileURLToPath } from "node:url";
import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import { NormalizedAdapter } from "json-server/lib/adapters/normalized-adapter.js";
import { Observer } from "json-server/lib/adapters/observer.js";
import { createApp } from "json-server/lib/app.js";

const port = Number(process.env.PORT ?? 3001);
const startedAt = performance.now();
const colorEnabled = Boolean(process.stdout.isTTY && !process.env.NO_COLOR);
const databasePath = new URL("./db.json", import.meta.url);
const adapter = new NormalizedAdapter(new JSONFile(fileURLToPath(databasePath)));
const database = new Low(new Observer(adapter), {});

await database.read();

const color = (value, code) => colorEnabled ? `\u001b[${code}m${value}\u001b[0m` : value;
const bold = (value) => color(value, "1");
const gray = (value) => color(value, "90");
const cyan = (value) => color(value, "36");
const green = (value) => color(value, "32");
const red = (value) => color(value, "31");
const yellow = (value) => color(value, "33");

const app = createApp(database);
const attach = app.attach;

app.attach = (request, response, next) => {
  const requestStartedAt = performance.now();
  const { method, url } = request;

  response.once("finish", () => {
    const duration = Math.round(performance.now() - requestStartedAt);
    const methodColor = method === "GET" ? green : method === "DELETE" ? red : yellow;
    const statusColor = response.statusCode >= 500 ? red : response.statusCode >= 400 ? yellow : green;
    console.log(
      `${methodColor(method)} ${cyan(url)} ${statusColor(response.statusCode)} ${gray(`in ${duration}ms`)}`
    );
  });

  return attach(request, response, next);
};

app.listen(port, () => {
  const endpoints = Object.keys(database.data)
    .map((name) => `  http://localhost:${port}/${name}`)
    .join("\n");

  console.log([
    bold("▲ JSON Server"),
    `- Local: http://localhost:${port}`,
    "",
    green("✓ Starting..."),
    green(`✓ Ready in ${Math.round(performance.now() - startedAt)}ms`),
    "",
    bold("Endpoints:"),
    endpoints,
    "",
  ].join("\n"));
});
