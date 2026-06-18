import type {
	CreateMediaDatabaseDTO,
	CreateVideoChannelDTO,
	CreateVideoGamePlaythroughDTO,
	MediaFilters,
	UpdateVideoChannelDTO,
} from "@/shared/dtos";
import type { MediaRepository } from "@/shared/repositories";
import {
	Category,
	type LiteraryWorkChapter,
	type Media,
	type Video,
	type VideoChannel,
	type VideoGamePlaythrough,
} from "@/shared/types";

type StoredMedia = Record<string, any> & { category: Category; id: string };
type StoredChapter = { id: string; number: number; sourceId: string };

/** In-memory MediaRepository for DB-free unit tests. */
export class MockMediaRepository implements MediaRepository {
	public media: StoredMedia[] = [];
	public channels: VideoChannel[] = [];
	public chapters: StoredChapter[] = [];
	public videoGamePlaythroughs: VideoGamePlaythrough[] = [];
	private seq = 0;

	private nextId(): string {
		this.seq += 1;
		return `id-${this.seq}`;
	}

	public async create(data: CreateMediaDatabaseDTO): Promise<{ id: string }> {
		const id = this.nextId();
		this.media.push({ ...data, id });

		if (data.category === Category.CHAPTER) {
			this.chapters.push({ id, number: data.number, sourceId: data.sourceId });
		}

		return { id };
	}

	public async createChapters(workId: string, chapters: number): Promise<void> {
		for (let number = 1; number <= chapters; number += 1) {
			const id = this.nextId();
			this.chapters.push({ id, number, sourceId: workId });
			this.media.push({ category: Category.CHAPTER, id, number, sourceId: workId });
		}
	}

	public async createVideoChannel(data: CreateVideoChannelDTO): Promise<VideoChannel> {
		const channel: VideoChannel = {
			createdAt: new Date(),
			externalId: data.externalId ?? null,
			id: this.nextId(),
			link: data.link ?? null,
			name: data.name,
			updatedAt: new Date(),
		};
		this.channels.push(channel);
		return channel;
	}

	public async createVideoGamePlaythrough({ name, videoGameId }: CreateVideoGamePlaythroughDTO): Promise<{ id: string }> {
		const run: VideoGamePlaythrough = {
			createdAt: new Date(),
			id: this.nextId(),
			name: name ?? "",
			updatedAt: new Date(),
			videoGameId,
		};
		this.videoGamePlaythroughs.push(run);
		return { id: run.id };
	}

	public async find(shallow: boolean, category?: Category, filters?: MediaFilters): Promise<Media[]> {
		let result = this.media.filter(m => !category || m.category === category);

		if (filters?.mediaId) {
			result = result.filter(m => filters.mediaId!.includes(m.id));
		}
		if (filters?.title) {
			const needle = filters.title.toLowerCase();
			result = result.filter(m =>
				JSON.stringify(m.title ?? "")
					.toLowerCase()
					.includes(needle),
			);
		}

		return result as unknown as Media[];
	}

	public async findById(category: Category, id: string): Promise<Record<string, any> | undefined> {
		if (category === Category.CHAPTER || category === Category.LITERARY_WORK) {
			return this.media.find(m => m.id === id && m.category === Category.LITERARY_WORK) ?? undefined;
		}
		return this.media.find(m => m.id === id && m.category === category) ?? undefined;
	}

	public async findChannelByExternalId(externalId: string): Promise<VideoChannel | undefined> {
		return this.channels.find(c => c.externalId === externalId) ?? undefined;
	}

	public async findChannelByUrl(url: string): Promise<VideoChannel | undefined> {
		return this.channels.find(c => c.link === url) ?? undefined;
	}

	public async findChapter(sourceId: string, number: number): Promise<LiteraryWorkChapter | undefined> {
		const chapter = this.chapters.find(c => c.sourceId === sourceId && c.number === number);
		if (!chapter) {
			return undefined;
		}

		return {
			averageTime: null,
			createdAt: new Date(),
			id: chapter.id,
			number: chapter.number,
			pages: null,
			releaseDate: null,
			sourceId: chapter.sourceId,
			title: null,
			updatedAt: new Date(),
		};
	}

	public async findVideoByUrl(url: string): Promise<Video | undefined> {
		return (
			(this.media.find(m => m.category === Category.VIDEO && m.link === url) as unknown as Video) ?? undefined
		);
	}

	public async findVideoGamePlaythroughs(videoGameId: string): Promise<VideoGamePlaythrough[]> {
		return this.videoGamePlaythroughs
			.filter(run => run.videoGameId === videoGameId)
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	public async updateChannel(id: string, data: UpdateVideoChannelDTO): Promise<void> {
		const channel = this.channels.find(c => c.id === id);
		if (channel) {
			Object.assign(channel, data);
		}
	}
}
