import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Picks the best title for the current language out of an i18n title record. */
export function pickTitle(title: Record<string, string[] | string> | null | undefined, lang: string): string {
	if (!title) {
		return "—";
	}

	const langKey =
		Object.keys(title).find(key => key.toLowerCase() === lang.toLowerCase()) ||
		Object.keys(title).find(key => lang.toLowerCase().startsWith(key.toLowerCase())) ||
		Object.keys(title).find(key => key.toLowerCase().startsWith(lang.split("-")[0].toLowerCase())) ||
		"default";

	const value = title[langKey] ?? Object.values(title)[0];

	if (Array.isArray(value)) {
		return value[0] ?? "—";
	}

	return value ?? "—";
}

/** Composes an ISO 8601 duration (PTxHxMxS) from hours/minutes/seconds. */
export function toIso8601Duration(hours: number, minutes: number, seconds: number): string | undefined {
	if (!hours && !minutes && !seconds) {
		return undefined;
	}

	let duration = "PT";
	if (hours) duration += `${hours}H`;
	if (minutes) duration += `${minutes}M`;
	if (seconds) duration += `${seconds}S`;

	return duration;
}

/** Formats a duration in seconds as "xh ym zs". */
export function formatSeconds(totalSeconds: number | null | undefined): string {
	if (totalSeconds == null) {
		return "—";
	}

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return (
		[hours && `${hours}h`, minutes && `${minutes}m`, seconds && `${seconds}s`].filter(Boolean).join(" ") ||
		"0s"
	);
}
