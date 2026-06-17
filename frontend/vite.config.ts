import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
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
	plugins: [
		tanstackStart({
			// Explicit allowlist of public, data-light routes to prerender to static HTML
			// (crawler-visible meta + faster first paint). The authed app routes render empty
			// server-side (data is client-fetched) and stay client-rendered via the SPA shell.
			pages: [
				{ path: "/", prerender: { enabled: true } },
				{ path: "/auth", prerender: { enabled: true }, sitemap: { exclude: true } },
			],
			prerender: {
				autoStaticPathsDiscovery: false,
				crawlLinks: false,
				enabled: true,
			},
			router: {
				routeFileIgnorePattern: "^components$",
			},
			sitemap: {
				host: process.env.VITE_APP_URL,
			},
			spa: {
				enabled: true,
			},
		}),
		tailwindcss(),
		react(),
		svgr(),
	],
	// Prerender drives an internal `vite preview` server and fetches it at its resolved host.
	// Pin to IPv4 so it works in containers where `localhost` resolves to IPv6 (::1) but the
	// server binds 127.0.0.1 → ConnectionRefused.
	preview: {
		host: "127.0.0.1",
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		allowedHosts: [process.env.VITE_APP_URL || ""]
			.filter(Boolean)
			.map(each => each.replace(/(^https?:\/\/|\/$)/g, "")),
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
