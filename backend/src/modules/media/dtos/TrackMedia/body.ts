import { Category } from "@/shared/types";
import { t } from "elysia";

// `bookmarked` is inlined into every variant instead of `t.Intersect([{ bookmarked }, union])`
// — the CLAUDE.md DTO rule forbids t.Intersect because it resolves poorly at validation time.
export const TrackMediaBody = t.Union([
	t.Object({
		bookmarked: t.Optional(t.Boolean()),
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
		bookmarked: t.Optional(t.Boolean()),
		category: t.Literal(Category.MOVIE),
		mediaId: t.String(),
		rating: t.Optional(t.Number()),
		when: t.Optional(t.Nullable(t.Date())),
	}),
	t.Object({
		bookmarked: t.Optional(t.Boolean()),
		category: t.Literal(Category.VIDEO),
		link: t.Optional(t.String({ format: "uri" })),
		timeSpent: t.Optional(t.String()),
		when: t.Optional(t.Nullable(t.Date())),
	}),
	t.Object({
		bookmarked: t.Optional(t.Boolean()),
		category: t.Literal(Category.VIDEO_GAME),
		mediaId: t.String(),
		score: t.Optional(t.Nullable(t.Number())),
		offset: t.Optional(t.Nullable(t.String())),
		review: t.Optional(t.Nullable(t.String())),
		timeSpent: t.Optional(t.String()),
	}),
]);
export type TrackMediaBody = typeof TrackMediaBody.static;
