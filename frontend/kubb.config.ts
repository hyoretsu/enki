import path from "node:path";
import { createConfig } from "@hyoretsu/kubb/config";
import type { Config } from "@kubb/core";

export default createConfig({
	config: {
		api: {
			jsonPath: path.resolve(__dirname, "../backend/infra/generated/openapi.json"),
			name: "api",
		},
	},
}) as Config;
