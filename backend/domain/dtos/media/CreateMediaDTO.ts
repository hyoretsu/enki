import type { Category, LiteraryWorkType, Title } from "../../types";

export class CreateChapterDTO {
	number!: number;
	pages?: number;
	readingTime?: number;
	releaseDate?: Date;
	sourceId!: string;
	title?: Title;
}

export class CreateLiteraryWorkDTO {
	currentChapters?: number;
	ongoing?: boolean;
	synopsis?: string;
	tags?: string[];
	title!: Title;
	type!: LiteraryWorkType;
}

export class CreateMovieDTO {
	duration?: string;
	releaseDate?: Date;
	title!: Title;
}

export class CreateVideoDTO {
	duration?: string;
	link?: string;
	title?: string;
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
			title: string;
	  });
