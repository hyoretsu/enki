import type {
	CreateMediaDatabaseDTO,
	CreateVideoChannelDTO,
	CreateVideoGameRunDTO,
	UpdateVideoChannelDTO,
} from "../dtos";
import type { LiteraryWorkChapter, Video, VideoChannel, VideoGameRun } from "../entities";
import type { Category, Media } from "../types";

export class MediaFilters {
	mediaId?: string[];
	title?: string;
}

export abstract class MediaRepository {
	abstract create(data: CreateMediaDatabaseDTO): Promise<{ id: string }>;
	abstract createChapters(workId: string, chapters: number): Promise<void>;
	abstract createVideoChannel(data: CreateVideoChannelDTO): Promise<VideoChannel>;
	abstract createVideoGameRun(data: CreateVideoGameRunDTO): Promise<{ id: string }>;
	abstract find(shallow: boolean, category?: Category, filters?: MediaFilters): Promise<Media[]>;
	abstract findById(category: Category, id: string): Promise<Record<string, any> | undefined>;
	abstract findChannelByExternalId(externalId: string): Promise<VideoChannel | undefined>;
	abstract findChannelByUrl(url: string): Promise<VideoChannel | undefined>;
	abstract findChapter(sourceId: string, number: number): Promise<LiteraryWorkChapter | undefined>;
	abstract findVideoByUrl(url: string): Promise<Video | undefined>;
	abstract findVideoGameRuns(videoGameId: string): Promise<VideoGameRun[]>;
	abstract updateChannel(id: string, data: UpdateVideoChannelDTO): Promise<void>;
}
