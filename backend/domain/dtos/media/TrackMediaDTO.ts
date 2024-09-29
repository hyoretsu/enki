import type { Category, IntlField } from "../../types";

class TrackChapterDTO {
	category!: Category.CHAPTER;
	mediaId!: string;
	number!: number;
	pages?: number | null;
	releaseDate?: Date | null;
	timeSpent?: string | null;
	title?: IntlField | null;
	when?: Date | null;
}

class TrackMovieDTO {
	category!: Category.MOVIE;
	mediaId!: string;
	rating?: number;
	when?: Date | null;
}

class TrackVideoDTO {
	category!: Category.VIDEO;
	link?: string;
	timeSpent?: string;
	when?: Date | null;
}

class TrackVideoGameDTO {
	category!: Category.VIDEO_GAME;
	mediaId!: string;
	score?: number | null;
	offset?: string | null;
	timeSpent?: string;
}

export type TrackMediaDTO = {
	bookmarked?: boolean;
	userId: string;
} & (TrackChapterDTO | TrackMovieDTO | TrackVideoDTO | TrackVideoGameDTO);
