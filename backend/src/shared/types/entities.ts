import type { IntlField, LiteraryWorkType } from ".";

export type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type LiteraryWork = {
	id: string;
	title: IntlField;
	synopsis: Record<string, any> | null;
	type: LiteraryWorkType;
	tags: string[];
	releaseDate: Date | null;
	averageTime: number | null;
	ongoing: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type LiteraryWorkChapter = {
	id: string;
	title: Record<string, any> | null;
	number: number;
	releaseDate: Date | null;
	pages: number | null;
	averageTime: number | null;
	sourceId: string;
	createdAt: Date;
	updatedAt: Date;
};

export type Movie = {
	id: string;
	title: IntlField;
	duration: number | null;
	releaseDate: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export type Video = {
	id: string;
	title: IntlField;
	link: string | null;
	releaseDate: Date | null;
	duration: number | null;
	channelId: string;
	playlistId: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type VideoChannel = {
	id: string;
	name: string;
	link: string | null;
	externalId: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type VideoGame = {
	id: string;
	title: IntlField;
	releaseDate: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export type VideoGameRun = {
	id: string;
	videoGameId: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
};

export type VideoPlaylist = {
	id: string;
	title: string;
	link: string | null;
	channelId: string | null;
	createdAt: Date;
	updatedAt: Date;
};
