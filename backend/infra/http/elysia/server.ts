import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { HttpException } from "@enki/domain";
import { Elysia } from "elysia";
import { UsersController } from "./controllers";

export const app = new Elysia()
	.error({ HttpException })
	.onError(({ code, error, set }) => {
		switch (code) {
			case "HttpException":
				set.status = error.statusCode;
				return error.message;
		}
	})
	.use(cors())
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
						name: "Users",
						description: "Users of the app.",
					},
				],
			},
			path: "/docs",
			exclude: ["/docs", "/docs/json"],
		}),
	)
	.use(UsersController)
	.listen(process.env.PORT || 3333);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
