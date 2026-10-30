// Use the pinned CLI and read its machine-readable result; never print tokens.
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { Makers } from "@edgeone/makers-sdk";

const env = process.argv[2];
if (!["preview", "production"].includes(env)) throw new Error("Expected preview or production");
if (!process.env.EDGEONE_API_TOKEN) throw new Error("EDGEONE_API_TOKEN is required");
const makers = new Makers({ token: process.env.EDGEONE_API_TOKEN, region: "china" });
const project = await makers.projects.get({ projectId: "makers-kjd68tcyocsk" });
if (project.name !== "nerchat" || project.area !== "mainland") {
    throw new Error("Project identity or mainland region mismatch; refusing deployment");
}
const result = spawnSync("./node_modules/.bin/edgeone", [
    "makers", "deploy", "./dist", "--name", "nerchat", "--env", env,
    "--site", "china", "--skip-ai-gateway-sync", "--json",
    "--token", process.env.EDGEONE_API_TOKEN,
], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
const output = (result.stdout ?? "") + (result.stderr ?? "");
console.log(output.replaceAll(process.env.EDGEONE_API_TOKEN, "[REDACTED]"));
if (result.status !== 0) process.exit(result.status ?? 1);
const line = output.split("\n").findLast(line => line.startsWith('{"status":'));
if (!line) throw new Error("No deployment result returned");
const deployment = JSON.parse(line);
if (deployment.status !== "success") throw new Error("Deployment was not successful");
fs.writeFileSync(`.work/${env}.json`, JSON.stringify(deployment, null, 2));
console.log(`Saved ${env} deployment result`);
