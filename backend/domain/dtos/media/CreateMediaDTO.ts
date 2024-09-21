import type { Category, Title } from "../../types";

export class CreateChapterDTO {
	number: number;
	pages?: number;
	readingTime?: number;
	releaseDate?: Date;
	sourceId: string;
	title?: Title;
}

export class CreateMovieDTO {
	duration?: number;
	releaseDate?: Date;
	title: Title;
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
	| (CreateMovieDTO & {
			category: Category.MOVIE;
	  })
	| (CreateVideoDTO & {
			category: Category.VIDEO;
			channelId: string;
			title: string;
	  });
