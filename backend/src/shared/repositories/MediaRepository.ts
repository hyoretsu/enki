import type {
	CreateMediaDatabaseDTO,
	CreateVideoChannelDTO,
	MediaFilters,
	UpdateVideoChannelDTO,
} from "@/shared/dtos";
import type { Category, LiteraryWorkChapter, Media, Video, VideoChannel } from "@/shared/types";

export abstract class MediaRepository {
	abstract create(data: CreateMediaDatabaseDTO): Promise<{ id: string }>;
	abstract createChapters(workId: string, chapters: number): Promise<void>;
	abstract createVideoChannel(data: CreateVideoChannelDTO): Promise<VideoChannel>;
	abstract find(shallow: boolean, category?: Category, filters?: MediaFilters): Promise<Media[]>;
	abstract findById(category: Category, id: string): Promise<Record<string, any> | undefined>;
	abstract findChannelByExternalId(externalId: string): Promise<VideoChannel | undefined>;
	abstract findChannelByUrl(url: string): Promise<VideoChannel | undefined>;
	abstract findChapter(sourceId: string, number: number): Promise<LiteraryWorkChapter | undefined>;
	abstract findVideoByUrl(url: string): Promise<Video | undefined>;
	abstract updateChannel(id: string, data: UpdateVideoChannelDTO): Promise<void>;
}
