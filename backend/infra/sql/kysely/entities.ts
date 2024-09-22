import type { Selectable, Updateable } from "kysely";
import type { LiteraryWork, LiteraryWorkChapter, Movie, User, Video, VideoChannel, VideoGame } from "./types";

export type LiteraryWorkSelectable = Selectable<LiteraryWork>;
export type LiteraryWorkChapterSelectable = Selectable<LiteraryWorkChapter>;
export type MovieSelectable = Selectable<Movie>;
export type UserSelectable = Selectable<User>;
export type VideoSelectable = Selectable<Video>;
export type VideoChannelUpdateable = Updateable<VideoChannel>;
export type VideoChannelSelectable = Selectable<VideoChannel>;
export type VideoGameSelectable = Selectable<VideoGame>;
