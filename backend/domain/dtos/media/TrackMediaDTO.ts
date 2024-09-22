import type { Category } from "../../types";

export class TrackMediaDTO {
	bookmarked?: boolean;
	category!: Category;
	link?: string;
	mediaId?: string;
	number?: number;
	rating?: number;
	timeSpent?: string;
	userId!: string;
	when?: Date | null;
}
