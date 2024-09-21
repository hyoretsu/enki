import type { Category } from "../../types";

export class TrackMediaUserDTO {
	bookmarked?: boolean;
	category: Category;
	email: string;
	mediaId: string;
	number?: number;
	timeSpent?: string;
	when?: Date;
}
