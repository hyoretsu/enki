import { timeConversion } from "@hyoretsu/utils";
import { QueryClient } from "@tanstack/react-query";

export const reactQueryClient = new QueryClient({
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
