import type { Category, IntlField, IntlFieldArr, LiteraryWorkType } from "../../types";

export class CreateChapterDTO {
	number!: number;
	pages?: number;
	readingTime?: number;
	releaseDate?: Date;
	sourceId!: string;
	title?: IntlFieldArr;
}

export class CreateLiteraryWorkDTO {
	currentChapters?: number;
	ongoing?: boolean;
	synopsis?: IntlField;
	tags?: string[];
	title!: IntlFieldArr;
	type!: LiteraryWorkType;
}

export class CreateMovieDTO {
	duration?: string;
	releaseDate?: Date;
	title!: IntlFieldArr;
}

export class CreateVideoDTO {
	duration?: string;
	link?: string;
	title?: IntlFieldArr;
}

export class CreateVideoGameDTO {
	title!: IntlFieldArr;
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
			duration: number;
	  })
	| (CreateVideoDTO & {
			category: Category.VIDEO;
			channelId: string;
			title: IntlFieldArr;
	  })
	| (CreateVideoGameDTO & {
			category: Category.VIDEO_GAME;
	  });
