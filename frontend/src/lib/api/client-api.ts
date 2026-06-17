import { createClient } from "@hyoretsu/kubb/client";
import ky, { isHTTPError } from "ky";

export type { Client, RequestConfig, ResponseConfig, ResponseErrorConfig } from "@hyoretsu/kubb/client";

export default createClient(
	ky.extend({
		baseUrl: import.meta.env.VITE_API_URL,
		credentials: "include",
		hooks: {
			beforeError: [
				({ error }) => {
					if (isHTTPError(error)) {
						if (error.response.status === 401 && !window.location.pathname.startsWith("/auth")) {
							window.location.replace("/auth");
						}
					}

					return error;
				},
			],
		},
		timeout: false,
	}),
);
