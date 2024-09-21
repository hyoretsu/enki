import type { LiteraryWorkChapter, Movie, Video } from "../entities";

export enum Category {
	CHAPTER = "chapter",
	LITERARY_WORK = "literary_work",
	MOVIE = "movie",
	VIDEO = "video",
}

export enum Categories {
	CHAPTER = "chapters",
	MOVIE = "movies",
	VIDEO = "videos",
}

export type Media =
	| Omit<LiteraryWorkChapter, "createdAt" | "updatedAt">
	| Omit<Movie, "createdAt" | "updatedAt">
	| Omit<Video, "createdAt" | "updatedAt">;

export type Title = Record<string, string[]>;
