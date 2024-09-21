import { CreateMedia, TrackMedia } from "@enki/application";
import { Category } from "@enki/domain";
import { Elysia, t } from "elysia";
import { mediaRepository, usersRepository } from "~/sql/kysely";

export const MediaController = new Elysia()
	.decorate({
		mediaRepository,
		usersRepository,
	})
	.group("/media", app => {
		const { mediaRepository, usersRepository } = app.decorator;

		return app
			.decorate({
				createMedia: new CreateMedia(mediaRepository),
				trackMedia: new TrackMedia(mediaRepository, usersRepository),
			})
			.post("/", ({ body, createMedia }) => createMedia.execute(body), {
				detail: {
					tags: ["Media"],
				},
				body: t.Union([
					t.Object({
						category: t.Literal(Category.CHAPTER),
						number: t.Number(),
						pages: t.Optional(t.Integer()),
						readingTime: t.Optional(t.Integer()),
						releaseDate: t.Optional(t.Date()),
						sourceId: t.String(),
						title: t.Record(t.String(), t.Array(t.String())),
					}),
					t.Object({
						category: t.Literal(Category.MOVIE),
						duration: t.Optional(t.Integer()),
						releaseDate: t.Optional(t.Date()),
						title: t.Record(t.String(), t.Array(t.String())),
					}),
					t.Object({
						category: t.Literal(Category.VIDEO),
						duration: t.Optional(t.String()),
						link: t.Optional(t.String({ format: "uri" })),
						title: t.Optional(t.String()),
					}),
				]),
				response: t.String(),
			})
			.post("/track", ({ body, query, trackMedia }) => trackMedia.execute({ ...body, ...query }), {
				detail: {
					tags: ["Media"],
				},
				body: t.Union([
					t.Object(
						{
							bookmarked: t.Optional(t.Boolean()),
							link: t.Optional(t.String({ format: "uri" })),
							timeSpent: t.Optional(t.String()),
							when: t.Optional(t.Date()),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							bookmarked: t.Optional(t.Boolean()),
							mediaId: t.String(),
							number: t.Integer(),
							timeSpent: t.Optional(t.String()),
							when: t.Optional(t.Date()),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							bookmarked: t.Optional(t.Boolean()),
							mediaId: t.Optional(t.String()),
							rating: t.Optional(t.Number()),
							when: t.Optional(t.Date()),
						},
						{ additionalProperties: false },
					),
				]),
				query: t.Object({
					category: t.Enum(Category),
					email: t.String({ format: "email" }),
				}),
				response: t.Void(),
			});
	});
