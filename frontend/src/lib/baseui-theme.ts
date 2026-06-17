import { createDarkTheme, createLightTheme } from "baseui";

export type EnkiThemeMode = "dark" | "light";

export const enkiLightTheme = createLightTheme({
	colors: {
		accent: "#22c55e",
		backgroundPrimary: "#f7f8fa",
		backgroundSecondary: "#ffffff",
		backgroundTertiary: "#eef1f4",
		borderOpaque: "#d7dee7",
		borderSelected: "#16a34a",
		buttonPrimaryFill: "#16a34a",
		buttonPrimaryHover: "#15803d",
		buttonPrimaryText: "#0b1120",
		contentPrimary: "#14171b",
		contentSecondary: "#53606c",
		contentTertiary: "#6b7785",
		inputBorder: "#c9d2dd",
		inputFill: "#ffffff",
		inputFillActive: "#ffffff",
		inputPlaceholder: "#9aa7b4",
		negative: "#c92a38",
		positive: "#16a34a",
		warning: "#a86000",
	},
});

export const enkiDarkTheme = createDarkTheme({
	colors: {
		accent: "#34d399",
		backgroundPrimary: "#0b1120",
		backgroundSecondary: "#131a2b",
		backgroundTertiary: "#1c2536",
		borderOpaque: "#26304a",
		borderSelected: "#34d399",
		buttonPrimaryFill: "#34d399",
		buttonPrimaryHover: "#10b981",
		buttonPrimaryText: "#0b1120",
		contentPrimary: "#e8edf6",
		contentSecondary: "#9aa7b4",
		contentTertiary: "#c3c7cc",
		inputBorder: "#26304a",
		inputFill: "#0b1120",
		inputFillActive: "#0b1120",
		inputPlaceholder: "#5b6571",
		negative: "#f87171",
		positive: "#34d399",
		warning: "#f59e0b",
	},
});

export function getEnkiTheme(mode: EnkiThemeMode) {
	return mode === "dark" ? enkiDarkTheme : enkiLightTheme;
}
