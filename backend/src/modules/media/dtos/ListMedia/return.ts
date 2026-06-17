import { t } from "elysia";

export const ListMediaReturn = t.Array(
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
);
export type ListMediaReturn = typeof ListMediaReturn.static;
