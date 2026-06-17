import type { Category, IntlField, LiteraryWorkType } from "@/shared/types";

export class CreateChapterDTO {
	number!: number;
	pages?: number;
	readingTime?: number;
	releaseDate?: Date;
	sourceId!: string;
	title?: IntlField;
}

export class CreateLiteraryWorkDTO {
	currentChapters?: number;
	ongoing?: boolean;
	synopsis?: IntlField;
	tags?: string[];
	title!: IntlField;
	type!: LiteraryWorkType;
}

export class CreateMovieDTO {
	duration?: string;
	releaseDate?: Date;
	title!: IntlField;
}

export class CreateVideoDTO {
	duration?: string;
	link!: string;
	releaseDate?: Date;
	title?: IntlField;
}

export class CreateVideoGameDTO {
	title!: IntlField;
}

export type CreateMediaDTO = {
	noCheck?: boolean;
} & (
	| (CreateChapterDTO & {
			category: Category.CHAPTER;
	  })
	| (CreateLiteraryWorkDTO & {
			category: Category.LITERARY_WORK;
	  })
	| (CreateMovieDTO & {
			category: Category.MOVIE;
	  })
	| (CreateVideoDTO & {
			category: Category.VIDEO;
	  })
	| (CreateVideoGameDTO & {
			category: Category.VIDEO_GAME;
	  })
);

export type CreateMediaDatabaseDTO =
	| (CreateChapterDTO & {
			category: Category.CHAPTER;
	  })
	| (Omit<CreateLiteraryWorkDTO, "currentChapters"> & {
			category: Category.LITERARY_WORK;
			tags: string[];
	  })
	| (Omit<CreateMovieDTO, "duration"> & {
			category: Category.MOVIE;
			duration?: number;
	  })
	| (Omit<CreateVideoDTO, "duration"> & {
			category: Category.VIDEO;
			channelId: string;
			duration?: number;
			title: IntlField;
	  })
	| (CreateVideoGameDTO & {
			category: Category.VIDEO_GAME;
	  });

export class CreateVideoChannelDTO {
	externalId?: string;
	link?: string;
	name!: string;
}

export type UpdateVideoChannelDTO = Partial<CreateVideoChannelDTO>;

export class MediaFilters {
	mediaId?: string[];
	title?: string;
}

export class ListMediaDTO extends MediaFilters {
	category?: Category;
}

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
