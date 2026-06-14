import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const LiteraryWorkType = {
    article: "article",
    biography: "biography",
    comics: "comics",
    diary: "diary",
    epic: "epic",
    essay: "essay",
    flash_fiction: "flash_fiction",
    graphic_novel: "graphic_novel",
    journal: "journal",
    light_novel: "light_novel",
    manga: "manga",
    manhua: "manhua",
    manhwa: "manhwa",
    memoir: "memoir",
    novel: "novel",
    novelette: "novelette",
    novella: "novella",
    poetry: "poetry",
    script: "script",
    short_story: "short_story",
    web_novel: "web_novel",
    webtoon: "webtoon"
} as const;
export type LiteraryWorkType = (typeof LiteraryWorkType)[keyof typeof LiteraryWorkType];
export type EntertainmentMedia = {
    id: string;
    title: Record<string,any>;
    releaseDate: Timestamp | null;
    category: string;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type LiteraryWork = {
    id: Generated<string>;
    title: Record<string,any>;
    synopsis: Record<string,any> | null;
    type: LiteraryWorkType;
    tags: string[];
    releaseDate: Timestamp | null;
    averageTime: number | null;
    ongoing: Generated<boolean>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type LiteraryWorkChapter = {
    id: Generated<string>;
    title: Record<string,any> | null;
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
    title: Record<string,any>;
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
    bookmarked: Generated<boolean>;
};
export type UserMovie = {
    id: Generated<string>;
    userId: string;
    movieId: string;
    progress: number | null;
    when: Timestamp | null;
    rating: number | null;
    bookmarked: Generated<boolean>;
};
export type UserVideo = {
    id: Generated<string>;
    userId: string;
    videoId: string;
    when: Timestamp | null;
    progress: string | null;
    bookmarked: Generated<boolean>;
};
export type UserVideoGame = {
    userId: string;
    videoGameId: string;
    score: number | null;
    review: string | null;
    timeSpent: string | null;
    offset: number | null;
    bookmarked: Generated<boolean>;
};
export type UserVideoGameRun = {
    id: Generated<string>;
    userId: string;
    runId: string;
    timeSpent: string | null;
};
export type Video = {
    id: Generated<string>;
    title: Record<string,any>;
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
    title: Record<string,any>;
    releaseDate: Timestamp | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type VideoGameRun = {
    id: Generated<string>;
    videoGameId: string;
    name: Generated<string>;
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
    UserVideoGameRun: UserVideoGameRun;
    Video: Video;
    VideoChannel: VideoChannel;
    VideoGame: VideoGame;
    VideoGameRun: VideoGameRun;
    VideoPlaylist: VideoPlaylist;
};
