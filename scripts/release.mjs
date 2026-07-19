import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const packagePath = resolve(repoRoot, "package.json");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const versionInput = args.find((arg) => !arg.startsWith("--"));

if (!versionInput || args.some((arg) => arg !== versionInput && arg !== "--dry-run")) {
  fail("Usage: npm run release -- <patch|minor|major|x.y.z> [--dry-run]");
}

if (Number(process.versions.node.split(".")[0]) < 24) {
  fail(`Node.js 24 or newer is required (found ${process.version}).`);
}

const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const currentVersion = packageJson.version;
const nextVersion = resolveVersion(currentVersion, versionInput);
const tag = `v${nextVersion}`;
const registry = "https://registry.npmjs.org";

console.log(`Preparing ${packageJson.name}@${nextVersion}`);
if (dryRun) {
  console.log("Dry run: no files, commits, tags, or pushes will be created.");
}

requireCleanMainBranch();
requireOrigin();
requireTagAvailable(tag);
requireVersionAvailable(packageJson.name, nextVersion, registry);

console.log("Running release checks...");
run(npmCommand, ["run", "release:check"]);
restoreBuildGeneratedFiles();

if (dryRun) {
  console.log(`Dry run passed. ${tag} is available for release.`);
  process.exit(0);
}

console.log(`Updating package version to ${nextVersion}...`);
run(npmCommand, ["version", nextVersion, "--no-git-tag-version"]);
run("git", ["diff", "--check"]);

console.log("Creating release commit and tag...");
run("git", ["add", "package.json", "package-lock.json"]);
run("git", ["commit", "-m", `release: ${tag}`]);
run("git", ["tag", "-a", tag, "-m", `Release ${tag}`]);

console.log("Pushing release commit and tag...");
run("git", ["push", "origin", "main"]);
run("git", ["push", "origin", tag]);

console.log(`Release ${tag} pushed.`);
console.log("GitHub Actions will run the final npm publish with provenance.");

function resolveVersion(version, input) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    fail(`Current package version is not a supported stable semver: ${version}`);
  }

  const current = match.slice(1).map(Number);
  if (["patch", "minor", "major"].includes(input)) {
    const [major, minor, patch] = current;
    if (input === "major") return `${major + 1}.0.0`;
    if (input === "minor") return `${major}.${minor + 1}.0`;
    return `${major}.${minor}.${patch + 1}`;
  }

  const exactMatch = /^(\d+)\.(\d+)\.(\d+)$/.exec(input);
  if (!exactMatch) {
    fail(`Invalid release version: ${input}`);
  }

  const requested = exactMatch.slice(1).map(Number);
  if (compareVersions(requested, current) <= 0) {
    fail(`Release version ${input} must be greater than the current version ${version}.`);
  }
  return input;
}

function compareVersions(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function requireCleanMainBranch() {
  const branch = capture("git", ["branch", "--show-current"]);
  if (branch !== "main") {
    fail(`Releases must start from main (currently on ${branch || "detached HEAD"}).`);
  }

  const status = capture("git", ["status", "--porcelain"]);
  if (status) {
    fail("The working tree must be clean before releasing.");
  }
}

function requireOrigin() {
  capture("git", ["remote", "get-url", "origin"]);
}

function requireTagAvailable(releaseTag) {
  if (capture("git", ["tag", "--list", releaseTag]) === releaseTag) {
    fail(`${releaseTag} already exists locally.`);
  }

  if (capture("git", ["ls-remote", "--tags", "origin", `refs/tags/${releaseTag}`])) {
    fail(`${releaseTag} already exists on origin.`);
  }
}

function requireVersionAvailable(name, version, npmRegistry) {
  const result = spawnSync(
    npmCommand,
    ["view", `${name}@${version}`, "version", "--registry", npmRegistry],
    { cwd: repoRoot, encoding: "utf8" },
  );

  if (result.status === 0) {
    fail(`${name}@${version} already exists on npm.`);
  }

  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (!/E404|404|not found|is not in this registry/i.test(output)) {
    fail(`Could not verify whether ${name}@${version} is available on npm.\n${output.trim()}`);
  }
}

function restoreBuildGeneratedFiles() {
  const changedFiles = capture("git", ["status", "--porcelain=v1", "-z"], { trim: false })
    .split("\0")
    .filter(Boolean)
    .map((line) => line.slice(3).trim());

  if (changedFiles.length === 0) return;

  const unexpectedFiles = changedFiles.filter((file) => file !== "next-env.d.ts");
  if (unexpectedFiles.length > 0) {
    fail(`Release checks changed unexpected files: ${unexpectedFiles.join(", ")}`);
  }

  run("git", ["restore", "--", "next-env.d.ts"]);
}

function capture(command, commandArgs, { trim = true } = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    fail(`Command failed: ${command} ${commandArgs.join(" ")}\n${(result.stderr ?? "").trim()}`);
  }

  const output = result.stdout ?? "";
  return trim ? output.trim() : output;
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    fail(`Command failed: ${command} ${commandArgs.join(" ")}`);
  }
}

function fail(message) {
  console.error(`Release failed: ${message}`);
  process.exit(1);
}
