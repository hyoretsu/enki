import { CreateMedia, ListMedia, TrackMedia } from "@enki/application";
import { Category, LiteraryWorkType } from "@enki/domain";
import { Elysia, t } from "elysia";
import { mediaRepository, usersRepository } from "~/sql/kysely";
// import { LiteraryWork, Movie, Video } from "../types";

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
				listMedia: new ListMedia(mediaRepository),
				trackMedia: new TrackMedia(mediaRepository, usersRepository),
			})
			.get("/", ({ listMedia, query }) => listMedia.execute(query), {
				detail: {
					tags: ["Media"],
				},
				query: t.Object({
					category: t.Enum(Category),
					title: t.Optional(t.String()),
				}),
				// response: t.Array(t.Union([LiteraryWork, Movie, Video])),
				response: t.Array(t.Record(t.String(), t.Any())),
			})
			.post("/", ({ body, createMedia }) => createMedia.execute(body), {
				detail: {
					tags: ["Media"],
				},
				body: t.Union([
					t.Object(
						{
							category: t.Literal(Category.CHAPTER),
							number: t.Number(),
							pages: t.Optional(t.Integer()),
							releaseDate: t.Optional(t.Date()),
							sourceId: t.String(),
							title: t.Record(t.String(), t.Array(t.String())),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							category: t.Literal(Category.LITERARY_WORK),
							currentChapters: t.Optional(t.Integer()),
							ongoing: t.Optional(t.Boolean()),
							synopsis: t.Optional(t.Record(t.String(), t.String())),
							tags: t.Optional(t.Array(t.String())),
							title: t.Record(t.String(), t.Array(t.String())),
							type: t.Enum(LiteraryWorkType),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							category: t.Literal(Category.MOVIE),
							duration: t.Optional(t.String()),
							releaseDate: t.Optional(t.Date()),
							title: t.Record(t.String(), t.Array(t.String())),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							category: t.Literal(Category.VIDEO),
							duration: t.Optional(t.String()),
							link: t.Optional(t.String({ format: "uri" })),
							title: t.Optional(t.String()),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							category: t.Literal(Category.VIDEO_GAME),
							title: t.Record(t.String(), t.Array(t.String())),
						},
						{ additionalProperties: false },
					),
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
							when: t.Optional(t.Nullable(t.Date())),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							bookmarked: t.Optional(t.Boolean()),
							mediaId: t.String(),
							number: t.Number(),
							timeSpent: t.String(),
							when: t.Optional(t.Nullable(t.Date())),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							bookmarked: t.Optional(t.Boolean()),
							mediaId: t.String(),
							rating: t.Optional(t.Number()),
							when: t.Optional(t.Nullable(t.Date())),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							bookmarked: t.Optional(t.Boolean()),
							mediaId: t.String(),
							score: t.Optional(t.Nullable(t.Number())),
							timeSpent: t.Optional(t.String()),
							offset: t.Optional(t.Nullable(t.String())),
						},
						{ additionalProperties: false },
					),
				]),
				query: t.Object({
					category: t.Enum(Category),
					userId: t.String(),
				}),
				response: t.Void(),
			});
	});
