import type { LiteraryWorkChapter, Movie, Video } from "../entities";

export enum Category {
	CHAPTER = "chapter",
	LITERARY_WORK = "literary_work",
	MOVIE = "movie",
	VIDEO = "video",
}

export type LiteraryWorkType =
	| "article"
	| "biography"
	| "comics"
	| "diary"
	| "epic"
	| "essay"
	| "flash_fiction"
	| "graphic_novel"
	| "journal"
	| "light_novel"
	| "manga"
	| "manhua"
	| "manhwa"
	| "memoir"
	| "novel"
	| "novelette"
	| "novella"
	| "poetry"
	| "script"
	| "short_story"
	| "web_novel"
	| "webtoon";

export type Media =
	| Omit<LiteraryWorkChapter, "createdAt" | "updatedAt">
	| Omit<Movie, "createdAt" | "updatedAt">
	| Omit<Video, "createdAt" | "updatedAt">;

export type Title = Record<string, string[]>;
