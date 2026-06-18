import type {
	CreateMediaDatabaseDTO,
	CreateVideoChannelDTO,
	CreateVideoGamePlaythroughDTO,
	MediaFilters,
	UpdateVideoChannelDTO,
} from "@/shared/dtos";
import type { Category, LiteraryWorkChapter, Media, Video, VideoChannel, VideoGamePlaythrough } from "@/shared/types";

export abstract class MediaRepository {
	abstract create(data: CreateMediaDatabaseDTO): Promise<{ id: string }>;
	abstract createChapters(workId: string, chapters: number): Promise<void>;
	abstract createVideoChannel(data: CreateVideoChannelDTO): Promise<VideoChannel>;
	abstract createVideoGamePlaythrough(data: CreateVideoGamePlaythroughDTO): Promise<{ id: string }>;
	abstract find(shallow: boolean, category?: Category, filters?: MediaFilters): Promise<Media[]>;
	abstract findById(category: Category, id: string): Promise<Record<string, any> | undefined>;
	abstract findChannelByExternalId(externalId: string): Promise<VideoChannel | undefined>;
	abstract findChannelByUrl(url: string): Promise<VideoChannel | undefined>;
	abstract findChapter(sourceId: string, number: number): Promise<LiteraryWorkChapter | undefined>;
	abstract findVideoByUrl(url: string): Promise<Video | undefined>;
	abstract findVideoGamePlaythroughs(videoGameId: string): Promise<VideoGamePlaythrough[]>;
	abstract updateChannel(id: string, data: UpdateVideoChannelDTO): Promise<void>;
}
