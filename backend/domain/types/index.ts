import type { LiteraryWorkChapter, Movie, SeriesEpisode, Video, VideoGame } from "../entities";

export enum Category {
	CHAPTER = "chapter",
	EPISODE = "episode",
	LITERARY_WORK = "literary_work",
	MOVIE = "movie",
	SERIES = "series",
	VIDEO = "video",
	VIDEO_GAME = "video_game",
}

export enum LiteraryWorkType {
	ARTICLE = "article",
	BIOGRAPHY = "biography",
	COMICS = "comics",
	DIARY = "diary",
	EPIC = "epic",
	ESSAY = "essay",
	FLASH_FICTION = "flash_fiction",
	GRAPHIC_NOVEL = "graphic_novel",
	JOURNAL = "journal",
	LIGHT_NOVEL = "light_novel",
	MANGA = "manga",
	MANHUA = "manhua",
	MANHWA = "manhwa",
	MEMOIR = "memoir",
	NOVEL = "novel",
	NOVELETTE = "novelette",
	NOVELLA = "novella",
	POETRY = "poetry",
	SCRIPT = "script",
	SHORT_STORY = "short_story",
	WEB_NOVEL = "web_novel",
	WEBTOON = "webtoon",
}

export type Media =
	| Omit<SeriesEpisode, "createdAt" | "updatedAt">
	| Omit<LiteraryWorkChapter, "createdAt" | "updatedAt">
	| Omit<Movie, "createdAt" | "updatedAt">
	| Omit<VideoGame, "createdAt" | "updatedAt">
	| Omit<Video, "createdAt" | "updatedAt">;

export type IntlField = Record<string, string>;
export type IntlFieldArr = Record<string, string[]>;
