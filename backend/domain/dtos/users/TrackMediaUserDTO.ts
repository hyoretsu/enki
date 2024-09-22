import type { Category } from "../../types";

export class TrackMediaUserDTO {
	bookmarked?: boolean;
	category: Category;
	mediaId: string;
	number?: number;
	timeSpent?: string;
	userId: string;
	when?: Date;
}
