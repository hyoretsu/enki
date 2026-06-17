import { getDriveToken, useSession } from "@/lib/auth-client";
import { syncWithDrive } from "@/lib/sync";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const INTERVAL_MS = 5 * 60 * 1000;

// Background two-way Drive sync while signed in: once on mount, again on window focus, and on
// an interval. Failures (e.g. the Google account isn't linked with the Drive scope) are
// swallowed — auto-sync is best-effort and the profile screen offers a manual trigger.
export function useAutoSync() {
	const { data: session } = useSession();
	const client = useQueryClient();

	useEffect(() => {
		if (!session) return;

		let cancelled = false;
		let running = false;

		const run = async () => {
			if (running) return;
			running = true;
			try {
				await syncWithDrive(getDriveToken);
				if (!cancelled) await client.invalidateQueries();
			} catch {
				// best-effort; manual sync surfaces errors
			} finally {
				running = false;
			}
		};

		void run();
		const onFocus = () => void run();
		window.addEventListener("focus", onFocus);
		const interval = setInterval(() => void run(), INTERVAL_MS);

		return () => {
			cancelled = true;
			window.removeEventListener("focus", onFocus);
			clearInterval(interval);
		};
	}, [session, client]);
}
