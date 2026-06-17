import { Category, LiteraryWorkType } from "@/shared/types";
import { t } from "elysia";

export const CreateMediaBody = t.Union(
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
);
export type CreateMediaBody = typeof CreateMediaBody.static;

export const CreateMediaReturn = t.String({ description: "Created media ID." });
export type CreateMediaReturn = typeof CreateMediaReturn.static;
