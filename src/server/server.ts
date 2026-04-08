import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, join, dirname } from "path";
import { parse as parseYaml } from "yaml";

interface Config {
  host: string;
  port: number;
  workspacePath: string;
  files: {
    code: string;
    test: string;
  };
}

interface SyncPayload {
  code?: string;
  test?: string;
}

function loadConfig(): Config {
  const configPath = resolve(process.cwd(), "config.yaml");

  if (!existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    console.error("Please create config.yaml at the project root.");
    process.exit(1);
  }

  const content = readFileSync(configPath, "utf-8");
  const config = parseYaml(content) as Config;

  if (
    !config.port ||
    !config.host ||
    !config.workspacePath ||
    !config.files?.code ||
    !config.files?.test
  ) {
    console.error(
      "Invalid config. Required fields: port, host, workspacePath, files.code, files.test"
    );
    process.exit(1);
  }

  return config;
}

const config = loadConfig();
const app = new Hono();

app.use(
  "*",
  cors({
    origin: "https://www.boot.dev",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  })
);

app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Boot.dev Sync Server is running",
  });
});

app.post("/sync", async (c) => {
  try {
    const payload = await c.req.json<SyncPayload>();

    if (!payload.code && !payload.test) {
      return c.json({ error: "Payload must contain 'code' or 'test'" }, 400);
    }

    const results: string[] = [];

    if (payload.code) {
      const codePath = join(config.workspacePath, config.files.code);
      mkdirSync(dirname(codePath), { recursive: true });
      writeFileSync(codePath, payload.code, "utf-8");
      results.push(`Written: ${config.files.code}`);
      console.log(`[SYNC] Written: ${codePath}`);
    }

    if (payload.test) {
      const testPath = join(config.workspacePath, config.files.test);
      mkdirSync(dirname(testPath), { recursive: true });
      writeFileSync(testPath, payload.test, "utf-8");
      results.push(`Written: ${config.files.test}`);
      console.log(`[SYNC] Written: ${testPath}`);
    }

    return c.json({ success: true, results });
  } catch (err) {
    console.error("[ERROR] Failed to process sync request:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

console.log("========================================");
console.log("  Boot.dev Local Sync Server");
console.log("========================================");
console.log(`  Listening: http://${config.host}:${config.port}`);
console.log(`  Workspace: ${config.workspacePath}`);
console.log(`  Code file: ${config.files.code}`);
console.log(`  Test file: ${config.files.test}`);
console.log("========================================");
console.log("  Waiting for sync requests...\n");

serve({
  fetch: app.fetch,
  port: config.port,
  hostname: config.host,
});
