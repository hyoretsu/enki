import { timeConversion } from "@hyoretsu/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onSuccess: (_data, _variables, _onMutateResult, context) => {
				context.client.invalidateQueries({ queryKey: context?.mutationKey });
			},
		},
		queries: {
			retry: 2,
			staleTime: timeConversion(1, "minutes", "milliseconds"),
		},
	},
});

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>
				{children}
				<ToastContainer position="bottom-center" theme="dark" />
			</NuqsAdapter>
		</QueryClientProvider>
	);
}
