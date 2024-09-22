import type { Category } from "../../types";

export class TrackMediaDTO {
	bookmarked?: boolean;
	category!: Category;
	email!: string;
	link?: string;
	mediaId?: string;
	number?: number;
	rating?: number;
	timeSpent?: string;
	when?: Date | null;
}
