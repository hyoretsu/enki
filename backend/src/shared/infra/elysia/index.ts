import { HttpException } from "@/shared/errors";
import { auth } from "@/shared/infra/betterAuth";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

export const app = new Elysia()
	.error({ HttpException })
	.onError(({ code, error, set }) => {
		switch (code) {
			case "HttpException":
				set.status = error.statusCode;
				return error.message;
		}
	})
	.use(
		cors({
			credentials: true,
			origin: (process.env.WEB_URL || "http://localhost:5173").split(","),
		}),
	)
	.all("/auth/*", ({ request }) => auth.handler(request))
	.onTransform(ctx => {
		if (typeof ctx.body === "string") {
			ctx.body = JSON.parse(ctx.body);
		}

		for (const name in ctx.query) {
			if (Array.isArray(ctx.query[name])) {
				ctx.query[name] = ctx.query[name][0].split(",");
			}
		}
	})
	.use(
		swagger({
			documentation: {
				info: {
					title: "Enki API",
					description: "",
					version: "1.0.0",
					contact: {
						email: "enki@midas-abgl.com",
						name: "Midas Group",
						url: "https://midas-abgl.com",
					},
				},
				tags: [
					{
						name: "Media",
						description: "Media categories.",
					},
					{
						name: "Users",
						description: "Users of the app.",
					},
				],
			},
			path: "/docs",
			exclude: ["/docs", "/docs/json"],
		}),
	);
