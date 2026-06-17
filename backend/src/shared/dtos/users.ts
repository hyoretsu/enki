import type { Category } from "@/shared/types";

export class GetStatisticsDTO {
	categories?: string[];
	userId!: string;
}

export class TrackMediaUserDTO {
	bookmarked?: boolean;
	category!: Category;
	mediaId!: string;
	number?: number;
	timeSpent?: string;
	userId!: string;
	when?: Date;
}

export class TrackVideoGameRunDTO {
	runId!: string;
	timeSpent?: number;
	userId!: string;
}
