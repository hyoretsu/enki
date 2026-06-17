import { spawnSync } from "node:child_process";

/**
 * Test orchestrator. Decides WHICH suites run and HOW, then shells out to `bun test` once per
 * suite. Suites are sequential and the first failure aborts with its exit code.
 *
 * Suite taxonomy (by file suffix):
 *   - unit  → `*.test.ts` EXCEPT the categorized suffixes below. DB-free (array-mock
 *             repositories), parallel. The ONLY suite that does not touch a database.
 *   - e2e   → `*.e2e.test.ts`. DB-backed: `tests/setup.ts` (preload) bootstraps the test
 *             database when `TEST_SCOPE !== "unit"`.
 *
 * Usage:
 *   bun scripts/test.ts              # all suites, in declaration order
 *   bun scripts/test.ts unit         # a single suite
 *   bun scripts/test.ts unit e2e     # a subset
 *   bun scripts/test.ts e2e --bail   # unknown tokens pass through to `bun test`
 */

/** Suffixes that identify a non-unit (DB-backed) suite; unit = everything else. */
const CATEGORIZED_SUFFIXES = ["e2e"] as const;

/** Suite name (= TEST_SCOPE value) → `bun test` arguments selecting its files + tuning flags. */
const SUITES = new Map<string, string[]>([
	[
		"unit",
		[
			"--concurrent",
			"--pass-with-no-tests",
			// Unit is the only DB-free, deterministic suite, so it's the one we measure coverage on.
			"--coverage",
			...CATEGORIZED_SUFFIXES.map(suffix => `--path-ignore-patterns=**/*.${suffix}.test.ts`),
		],
	],
	["e2e", ["--timeout", "20000", "--pass-with-no-tests", "e2e.test"]],
]);

const tokens = process.argv.slice(2);
const selectedNames = tokens.filter(t => SUITES.has(t) || t === "all");
const passthrough = tokens.filter(t => !SUITES.has(t) && t !== "all");

// No suite token → run everything; `all` is an explicit alias for the same.
const toRun =
	selectedNames.length === 0 || selectedNames.includes("all")
		? [...SUITES.keys()]
		: selectedNames.filter(name => name !== "all");

for (const name of toRun) {
	const args = SUITES.get(name);
	if (!args) continue;

	console.info(`\n▶ ${name} tests`);

	const result = spawnSync("bun", ["test", ...args, ...passthrough], {
		env: { ...process.env, TEST_SCOPE: name },
		stdio: "inherit",
	});

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}
