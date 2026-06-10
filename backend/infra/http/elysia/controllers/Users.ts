import { GetStatistics } from "@enki/application";
import { Category } from "@enki/domain";
import { Elysia, t } from "elysia";
import { usersRepository } from "~/sql";
import { authGuard } from "../guards";

const getStatistics = new GetStatistics(usersRepository);

export const UsersController = new Elysia().group("/users", app =>
	app
		.resolve(({ request }) => authGuard(request.headers))
		.get("/stats", ({ query, userId }) => getStatistics.execute({ ...query, userId }), {
			detail: {
				tags: ["Users"],
			},
			query: t.Object({
				categories: t.Optional(t.Array(t.Enum(Category))),
			}),
			response: t.Object({
				totalTime: t.Array(t.Integer()),
			}),
		}),
);
