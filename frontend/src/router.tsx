import { createRouter } from "@tanstack/react-router";
import { reactQueryClient } from "./lib/tanstack";
import { routeTree } from "./routeTree.gen";
import "./i18n/config";

export function getRouter() {
	return createRouter({
		context: {
			queryClient: reactQueryClient,
		},
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		routeTree,
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
