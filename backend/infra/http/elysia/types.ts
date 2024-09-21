import { t } from "elysia";

export const LiteraryWork = t.Object({
	id: t.String(),
	names: t.Nullable(t.Record(t.String(), t.Array(t.String()))),
	synopsis: t.Nullable(t.String()),
	type: t.String(),
	tags: t.Array(t.String()),
	ongoing: t.Boolean(),
});

export const Movie = t.Object({
	id: t.String(),
	title: t.Record(t.String(), t.Array(t.String())),
	duration: t.Nullable(t.Integer()),
	releaseDate: t.Nullable(t.Date()),
});

export const Video = t.Object({
	id: t.String(),
	title: t.String(),
	link: t.Nullable(t.String({ format: "uri" })),
	duration: t.Nullable(t.String()),
	channelId: t.String(),
	playlistId: t.Nullable(t.String()),
});
