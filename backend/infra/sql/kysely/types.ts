import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type EntertainmentMedia = {
	id: string;
	title: Record<string, any>;
	releaseDate: Timestamp | null;
	category: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type LiteraryWork = {
	id: Generated<string>;
	title: Record<string, any>;
	synopsis: Record<string, any> | null;
	type: string;
	tags: string[];
	releaseDate: Timestamp | null;
	averageTime: number | null;
	ongoing: Generated<boolean>;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type LiteraryWorkChapter = {
	id: Generated<string>;
	title: Record<string, any> | null;
	number: number;
	releaseDate: Timestamp | null;
	pages: number | null;
	averageTime: number | null;
	sourceId: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type Movie = {
	id: Generated<string>;
	title: Record<string, any>;
	duration: number | null;
	releaseDate: Timestamp | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type User = {
	id: Generated<string>;
	email: string;
	password: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type UserChapter = {
	id: Generated<string>;
	userId: string;
	chapterId: string;
	when: Timestamp | null;
	timeSpent: number | null;
	bookmarked: boolean | null;
};
export type UserMovie = {
	id: Generated<string>;
	userId: string;
	movieId: string;
	when: Timestamp | null;
	rating: number | null;
	bookmarked: boolean | null;
};
export type UserVideo = {
	id: Generated<string>;
	userId: string;
	videoId: string;
	when: Timestamp | null;
	timeSpent: string | null;
	bookmarked: boolean | null;
};
export type UserVideoGame = {
	userId: string;
	videoGameId: string;
	score: number | null;
	timeSpent: string | null;
	offset: number | null;
	bookmarked: boolean | null;
};
export type Video = {
	id: Generated<string>;
	title: Record<string, any>;
	link: string | null;
	releaseDate: Timestamp | null;
	duration: string | null;
	channelId: string;
	playlistId: string | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type VideoChannel = {
	id: Generated<string>;
	name: string;
	link: string | null;
	externalId: string | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type VideoGame = {
	id: Generated<string>;
	title: Record<string, any>;
	releaseDate: Timestamp | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type VideoPlaylist = {
	id: Generated<string>;
	title: string;
	link: string | null;
	channelId: string | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type DB = {
	EntertainmentMedia: EntertainmentMedia;
	LiteraryWork: LiteraryWork;
	LiteraryWorkChapter: LiteraryWorkChapter;
	Movie: Movie;
	User: User;
	UserChapter: UserChapter;
	UserMovie: UserMovie;
	UserVideo: UserVideo;
	UserVideoGame: UserVideoGame;
	Video: Video;
	VideoChannel: VideoChannel;
	VideoGame: VideoGame;
	VideoPlaylist: VideoPlaylist;
};
