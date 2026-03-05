const { spawn } = require("node:child_process");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [];
let shuttingDown = false;

function run(cwd, args) {
  const child = spawn(npmCmd, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });

  children.push(child);
  return child;
}

function stopProcessTree(child) {
  if (!child || child.killed || typeof child.pid !== "number") {
    return;
  }

  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
    return;
  }

  child.kill("SIGTERM");
}

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  children.forEach(stopProcessTree);

  setTimeout(() => {
    process.exit(code);
  }, 250);
}

const backend = run(path.join(repoRoot, "Server"), ["run", "dev"]);
const frontend = run(path.join(repoRoot, "client"), [
  "run",
  "dev",
  "--",
  "--host",
  "0.0.0.0",
]);

backend.on("exit", (code) => {
  if (!shuttingDown) {
    console.error(`backend exited with code ${code ?? "unknown"}`);
    shutdown(code ?? 1);
  }
});

frontend.on("exit", (code) => {
  if (!shuttingDown) {
    console.error(`frontend exited with code ${code ?? "unknown"}`);
    shutdown(code ?? 1);
  }
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
