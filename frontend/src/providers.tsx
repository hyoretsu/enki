import { QueryClientProvider } from "@tanstack/react-query";
import { BaseProvider } from "baseui";
import { NuqsAdapter } from "nuqs/adapters/react";
import { type ReactNode, Suspense, lazy, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Client, Server } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { type EnkiThemeMode, getEnkiTheme } from "./lib/baseui-theme";
import { reactQueryClient } from "./lib/tanstack";
import "react-toastify/dist/ReactToastify.css";

// Lazy: ConfirmDialog pulls baseui/modal, only needed when showAlert/showConfirm fires —
// keep it out of the first-paint bundle.
const ConfirmDialog = lazy(() =>
	import("./components/ui/ConfirmDialog").then(m => ({ default: m.ConfirmDialog })),
);

// The Client engine touches `document` in its constructor, which crashes during prerendering
// (no DOM). Use the Server engine when there is no document; baseui styles re-apply on client
// hydration.
const styletron = typeof document === "undefined" ? new Server() : new Client();

interface ProvidersProps {
	children: ReactNode;
}

function getDocumentThemeMode(): EnkiThemeMode {
	if (typeof document === "undefined") {
		return "dark";
	}

	const root = document.documentElement;
	if (root.classList.contains("light")) {
		return "light";
	}

	return "dark";
}

export function Providers({ children }: ProvidersProps) {
	const [themeMode, setThemeMode] = useState<EnkiThemeMode>(getDocumentThemeMode);

	useEffect(() => {
		const syncThemeMode = () => setThemeMode(getDocumentThemeMode());

		syncThemeMode();

		const observer = new MutationObserver(syncThemeMode);
		observer.observe(document.documentElement, { attributeFilter: ["class"], attributes: true });

		return () => observer.disconnect();
	}, []);

	return (
		<QueryClientProvider client={reactQueryClient}>
			<StyletronProvider value={styletron}>
				<BaseProvider theme={getEnkiTheme(themeMode)}>
					<NuqsAdapter>
						{children}
						<ToastContainer position="bottom-center" theme="dark" />
						<Suspense fallback={null}>
							<ConfirmDialog />
						</Suspense>
					</NuqsAdapter>
				</BaseProvider>
			</StyletronProvider>
		</QueryClientProvider>
	);
}
