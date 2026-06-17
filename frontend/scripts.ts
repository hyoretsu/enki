/* eslint-disable preserve-caught-error */
import { execSync } from "node:child_process";

const commands = new Map<string, () => void>([
	[
		"sdk:generate",
		() => {
			try {
				execSync("KUBB_DISABLE_TELEMETRY=1 bunx kubb generate", {
					stdio: "inherit",
				});
			} catch (e) {
				if (process.env.NODE_ENV === "production") {
					throw new Error("Failed to generate SDK.");
				}
			}
		},
	],
]);

const args = process.argv.slice(2);
const [command] = args;

const commandFn = commands.get(command);
if (!commandFn) {
	console.error(`Unknown command: ${command}`);
	process.exit(1);
}

console.info(`Running command: ${command}`);
try {
	commandFn();

	process.exit(0);
} catch (e) {
	if (e instanceof Error) {
		console.error(e.message);
	} else {
		throw e;
	}

	process.exit(1);
}
