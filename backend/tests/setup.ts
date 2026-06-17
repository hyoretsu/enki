import { spawnSync } from "node:child_process";
import path from "node:path";
import { Client } from "pg";

/**
 * Global test bootstrap (registered via bunfig.toml `[test] preload`). Runs ONCE before any
 * test file imports the `sql` client.
 *
 * Points at a dedicated test database via `DATABASE_TEST_URL` (a full connection string to an
 * already-existing database, separate from the dev `DATABASE_URL`) so tests never touch dev
 * data:
 *   1. require DATABASE_TEST_URL,
 *   2. repoint process.env.DATABASE_URL to it BEFORE `sql` is imported anywhere,
 *   3. wipe the public schema for a clean slate every run, then
 *   4. replay the Prisma Next baseline (`db init`) + migrations (`migrate`) against it.
 *
 * Unit tests are the ONLY DB-free suite (array-mock repositories); they opt out via
 * `TEST_SCOPE=unit` (set by `test:unit`).
 */

const SQL_DIR = path.resolve(import.meta.dir, "../../packages/sql");

function run(cmd: string, args: string[], env: Record<string, string>): void {
	const result = spawnSync(cmd, args, {
		cwd: SQL_DIR,
		env: { ...process.env, ...env },
		stdio: "pipe",
	});
	if (result.status !== 0) {
		const out = `${result.stdout?.toString() ?? ""}\n${result.stderr?.toString() ?? ""}`;
		throw new Error(`\`${cmd} ${args.join(" ")}\` failed (exit ${result.status}):\n${out}`);
	}
}

// Unit tests opt out of any DB work; every other suite hits the test database.
const needsDb = process.env.TEST_SCOPE !== "unit";

// A dedicated test database is MANDATORY for any DB-backed suite: refuse to fall back to
// whatever DATABASE_URL points at (dev/prod). When set we pin DATABASE_URL to it
// unconditionally — the adapter in `sql` reads DATABASE_URL at module load, so this must
// happen before anything imports it.
const testUrl = process.env.DATABASE_TEST_URL;
if (needsDb && !testUrl) {
	throw new Error(
		"DATABASE_TEST_URL must point at a dedicated test database to run DB-backed tests; refusing to run against DATABASE_URL (dev/prod).",
	);
}
if (testUrl) {
	process.env.DATABASE_URL = testUrl;
}

if (needsDb) {
	const dbUrl = testUrl as string;

	// Clean slate: drop and recreate the public schema (wipes any state left by a prior/crashed
	// run, including Prisma Next's own signing metadata), then replay baseline + migrations.
	const client = new Client({ connectionString: dbUrl });
	await client.connect();
	await client.query("DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;");
	await client.end();

	run("bun", ["run", "db:init"], { DATABASE_URL: dbUrl });
	run("bun", ["run", "migrate"], { DATABASE_URL: dbUrl });
}
