import { CreateUser } from "@enki/application";
import { type HashProviderKeys, hashProviders } from "@hyoretsu/providers";
import { Elysia, t } from "elysia";
import { KyselyUsersRepository, database } from "~/sql/kysely";

export const UsersController = new Elysia()
	.decorate({
		hashProvider: new hashProviders[process.env.HASH_DRIVER as HashProviderKeys](),
		usersRepository: new KyselyUsersRepository(database),
	})
	.group("/users", app => {
		const { hashProvider, usersRepository } = app.decorator;

		return app
			.decorate({
				createUser: new CreateUser(hashProvider, usersRepository),
			})
			.post("/", ({ body, createUser }) => createUser.execute(body), {
				detail: {
					tags: ["Users"],
				},
				body: t.Object({
					email: t.String({ format: "email" }),
					password: t.String(),
				}),
				response: t.Object({
					email: t.String({ examples: ["hello@example.com"] }),
					createdAt: t.Date({ examples: [new Date()] }),
					updatedAt: t.Date({ examples: [new Date()] }),
				}),
			});
	});
