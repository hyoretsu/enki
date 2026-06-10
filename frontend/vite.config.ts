import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	build: {
		minify: process.env.TAURI_ENV_DEBUG ? false : "esbuild",
		sourcemap: !!process.env.TAURI_ENV_DEBUG,
		target: "es2022",
	},
	clearScreen: false,
	envPrefix: ["VITE_", "TAURI_"],
	plugins: [tanstackRouter({ routeFileIgnorePattern: "^components$" }), react(), svgr()],
	resolve: {
		tsconfigPaths: true,
	},
	server: {
		allowedHosts: [process.env.VITE_APP_URL || ""]
			.filter(Boolean)
			.map(each => each.replace(/(^https?:\/\/|\/$)/, "")),
		hmr: host
			? {
					host,
					port: 5174,
					protocol: "ws",
				}
			: undefined,
		host: host || false,
		port: 5173,
		strictPort: true,
		watch: {
			ignored: ["**/src-tauri/**"],
		},
	},
});
