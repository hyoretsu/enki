import type { VideoChannelUpdateable } from "@enki/infra";
import type { CreateMediaDatabaseDTO, CreateVideoChannelDTO } from "../dtos";
import type { LiteraryWorkChapter, Video, VideoChannel } from "../entities";
import type { Category } from "../types";

export abstract class MediaRepository {
	abstract create(data: CreateMediaDatabaseDTO): Promise<{ id: string }>;
	abstract createVideoChannel(data: CreateVideoChannelDTO): Promise<VideoChannel>;
	abstract findById(category: Category, id: string): Promise<Record<string, any> | undefined>;
	abstract findChannelByExternalId(externalId: string): Promise<VideoChannel | undefined>;
	abstract findChannelByUrl(url: string): Promise<VideoChannel | undefined>;
	abstract findChapter(sourceId: string, number: number): Promise<LiteraryWorkChapter | undefined>;
	abstract findVideoByUrl(url: string): Promise<Video | undefined>;
	abstract updateChannel(id: string, data: VideoChannelUpdateable): Promise<void>;
}
