import { Category } from "@/shared/types";
import { t } from "elysia";

export const ListMediaQuery = t.Object({
	category: t.Optional(t.Enum(Category, { description: "Media category." })),
	mediaId: t.Optional(
		t.Array(t.String(), {
			description: "Media ID filter. When used alongside 'category', fetches more media details.",
		}),
	),
	title: t.Optional(t.String({ description: "Media title filter." })),
});
export type ListMediaQuery = typeof ListMediaQuery.static;
