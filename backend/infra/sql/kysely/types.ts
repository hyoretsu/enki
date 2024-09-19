import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type LiteraryWork = {
	id: Generated<string>;
	names: Record<string, any>;
	synopsis: string | null;
	type: string;
	tags: string[];
	ongoing: Generated<boolean>;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type LiteraryWorkChapter = {
	id: Generated<string>;
	title: Record<string, any> | null;
	number: number | null;
	releaseDate: Timestamp | null;
	pages: number | null;
	readingTime: number | null;
	sourceId: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type User = {
	email: string;
	password: string;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type UserChapter = {
	userEmail: string;
	chapterId: string;
	readAt: Timestamp | null;
	timeSpent: number | null;
	bookmarked: boolean | null;
};
export type UserVideo = {
	userEmail: string;
	videoId: string;
	when: Timestamp | null;
	watchTime: number | null;
	bookmarked: boolean | null;
};
export type Video = {
	id: Generated<string>;
	title: string;
	link: string | null;
	duration: number;
	channelId: string;
	playlistId: string | null;
	createdAt: Generated<Timestamp>;
	updatedAt: Generated<Timestamp>;
};
export type VideoChannel = {
	id: Generated<string>;
	name: string;
	link: string | null;
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
	LiteraryWork: LiteraryWork;
	LiteraryWorkChapter: LiteraryWorkChapter;
	User: User;
	UserChapter: UserChapter;
	UserVideo: UserVideo;
	Video: Video;
	VideoChannel: VideoChannel;
	VideoPlaylist: VideoPlaylist;
};
