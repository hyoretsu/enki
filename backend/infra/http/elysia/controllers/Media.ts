import { CreateMedia, ListMedia, TrackMedia } from "@enki/application";
import { Category, LiteraryWorkType } from "@enki/domain";
import { Elysia, t } from "elysia";
import { mediaRepository, usersRepository } from "~/sql";
import { authGuard } from "../guards";
// import { LiteraryWork, Movie, Video } from "../types";

const createMedia = new CreateMedia(mediaRepository);
const listMedia = new ListMedia(mediaRepository);
const trackMedia = new TrackMedia(mediaRepository, usersRepository);

export const MediaController = new Elysia().group("/media", app =>
	app
		.get("/", ({ query }) => listMedia.execute(query), {
			detail: {
				tags: ["Media"],
			},
			query: t.Object({
				category: t.Optional(t.Enum(Category, { description: "Media category." })),
				mediaId: t.Optional(
					t.Array(t.String(), {
						description: "Media ID filter. When used alongside 'category', fetches more media details.",
					}),
				),
				title: t.Optional(t.String({ description: "Media title filter." })),
			}),
			// response: t.Array(t.Union([LiteraryWork, Movie, Video])),
			response: t.Array(
				t.Union([
					t.Object(
						{
							id: t.String(),
							title: t.Nullable(t.Record(t.String(), t.Union([t.Array(t.String())]))),
							category: t.String(),
							releaseDate: t.Nullable(t.Date()),
						},
						{ description: "List of media." },
					),
					t.Record(t.String(), t.Any(), { description: "Full media information." }),
				]),
			),
		})
		.post("/", ({ body }) => createMedia.execute(body), {
			detail: {
				tags: ["Media"],
			},
			body: t.Union(
				[
					t.Object(
						{
							category: t.Literal(Category.CHAPTER),
							number: t.Number({ description: "Chapter's number in the series." }),
							pages: t.Optional(t.Integer({ description: "Number of pages in the chapter." })),
							releaseDate: t.Optional(t.Date({ description: "Chapter's original release date." })),
							sourceId: t.String({ description: "The literary work's ID." }),
							title: t.Optional(
								t.Record(t.String(), t.Array(t.String()), {
									description: "Titles by language code.",
								}),
							),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							category: t.Literal(Category.LITERARY_WORK),
							currentChapters: t.Optional(
								t.Integer({
									description:
										"Number of chapters already released. Automatically creates them without title and pages.",
								}),
							),
							ongoing: t.Optional(t.Boolean({ description: "Is the work not finished yet?" })),
							synopsis: t.Optional(
								t.Record(t.String(), t.Array(t.String()), { description: "Synopsis by language code." }),
							),
							tags: t.Optional(t.Array(t.String(), { description: "Category/genre tags" })),
							title: t.Record(t.String(), t.Array(t.String()), {
								description: "Titles by language code.",
							}),
							type: t.Enum(LiteraryWorkType),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							category: t.Literal(Category.MOVIE),
							duration: t.Optional(t.String({ description: "ISO 8601 duration.", examples: ["PT_H_M_S"] })),
							releaseDate: t.Optional(
								t.Date({
									examples: ["2024-12-25T00:00:00.000-03:00"],
								}),
							),
							title: t.Record(t.String(), t.Array(t.String()), {
								description: "Titles by language code.",
							}),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							category: t.Literal(Category.VIDEO),
							link: t.String({ description: "A youtube URL.", format: "uri" }),
						},
						{ additionalProperties: false },
					),
					t.Object(
						{
							category: t.Literal(Category.VIDEO_GAME),
							title: t.Record(t.String(), t.Array(t.String()), {
								description: "Title by language code.",
							}),
						},
						{ additionalProperties: false },
					),
				],
				{
					examples: [
						{
							category: "chapter",
							number: 1,
							pages: 12,
							releaseDate: "2024-12-25T00:00:00-03:00",
							sourceId: "27914233761075200",
							title: {
								en: ["The beginning of everything"],
							},
						},
						{
							category: "literary_work",
							currentChapters: 1,
							ongoing: false,
							synopsis: {
								en: "A story about everything.",
							},
							tags: ["Cultivation"],
							title: {
								en: ["I don't know"],
							},
							type: "manhua",
						},
						{
							category: "movie",
							duration: "PT2H5M30S",
							releaseDate: "2024-12-25T00:00:00-03:00",
							title: {
								en: ["Awesome movie"],
							},
						},
						{
							category: "video",
							link: "https://www.youtube.com/watch?v=1234",
						},
						{
							category: "video_game",
							title: {
								en: ["The game"],
							},
						},
					],
				},
			),
			response: t.String({ description: "Created media ID." }),
		})
		.resolve(({ request }) => authGuard(request.headers))
		.post("/track", ({ body, userId }) => trackMedia.execute({ ...body, userId }), {
			detail: {
				tags: ["Media"],
			},
			body: t.Intersect([
				t.Object({
					bookmarked: t.Optional(t.Boolean()),
				}),
				t.Union([
					t.Object({
						category: t.Literal(Category.CHAPTER),
						mediaId: t.String(),
						number: t.Number(),
						pages: t.Optional(t.Integer()),
						releaseDate: t.Optional(t.Date()),
						timeSpent: t.String(),
						when: t.Optional(t.Nullable(t.Date())),
						title: t.Optional(t.Record(t.String(), t.Array(t.String()))),
					}),
					t.Object({
						category: t.Literal(Category.MOVIE),
						mediaId: t.String(),
						rating: t.Optional(t.Number()),
						when: t.Optional(t.Nullable(t.Date())),
					}),
					t.Object({
						category: t.Literal(Category.VIDEO),
						link: t.Optional(t.String({ format: "uri" })),
						timeSpent: t.Optional(t.String()),
						when: t.Optional(t.Nullable(t.Date())),
					}),
					t.Object({
						category: t.Literal(Category.VIDEO_GAME),
						mediaId: t.String(),
						score: t.Optional(t.Nullable(t.Number())),
						offset: t.Optional(t.Nullable(t.String())),
						timeSpent: t.Optional(t.String()),
					}),
				]),
			]),
			response: t.Void(),
		}),
);
