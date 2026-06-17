import { authGuard } from "@/shared/infra/elysia/guards";
import { Elysia } from "elysia";
import { GetStatisticsQuery, GetStatisticsReturn } from "../../dtos";
import { buildGetStatistics } from "../../factories";

const getStatistics = buildGetStatistics();

export const UsersController = new Elysia().group("/users", app =>
	app
		.resolve(({ request }) => authGuard(request.headers))
		.get("/stats", ({ query, userId }) => getStatistics.execute({ ...query, userId }), {
			detail: {
				tags: ["Users"],
			},
			query: GetStatisticsQuery,
			response: GetStatisticsReturn,
		}),
);
