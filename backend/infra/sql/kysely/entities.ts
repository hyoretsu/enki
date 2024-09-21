import type { Selectable, Updateable } from "kysely";
import type { LiteraryWorkChapter, User, Video, VideoChannel } from "./types";

export type LiteraryWorkChapterSelectable = Selectable<LiteraryWorkChapter>;
export type UserSelectable = Selectable<User>;
export type VideoSelectable = Selectable<Video>;
export type VideoChannelUpdateable = Updateable<VideoChannel>;
export type VideoChannelSelectable = Selectable<VideoChannel>;
