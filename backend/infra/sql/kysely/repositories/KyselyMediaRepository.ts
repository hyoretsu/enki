import {
	Category,
	type CreateMediaDatabaseDTO,
	type CreateVideoChannelDTO,
	type LiteraryWorkChapter,
	type MediaRepository,
} from "@enki/domain";
import type { Kysely } from "kysely";
import type { VideoChannelSelectable, VideoChannelUpdateable, VideoSelectable } from "../entities";
import type { DB } from "../types";

export class KyselyMediaRepository implements MediaRepository {
	constructor(private readonly db: Kysely<DB>) {}

	public async create(data: CreateMediaDatabaseDTO): Promise<{ id: string }> {
		switch (data.category) {
			case Category.CHAPTER: {
				const { category, ...actualData } = data;

				return this.db
					.insertInto("LiteraryWorkChapter")
					.values(actualData)
					.returning("id")
					.executeTakeFirstOrThrow();
			}
			case Category.MOVIE: {
				const { category, ...actualData } = data;

				return this.db.insertInto("Movie").values(actualData).returning("id").executeTakeFirstOrThrow();
			}
			case Category.VIDEO: {
				const { category, ...actualData } = data;

				return this.db.insertInto("Video").values(actualData).returning("id").executeTakeFirstOrThrow();
			}
			default:
				throw new Error("Media unsupported.");
		}
	}

	public async createVideoChannel(data: CreateVideoChannelDTO): Promise<VideoChannelSelectable> {
		const channel = await this.db
			.insertInto("VideoChannel")
			.values(data)
			.returningAll()
			.executeTakeFirstOrThrow();

		return channel;
	}

	public async findById(category: Category, id: string): Promise<Record<string, any> | undefined> {
		let query: any;

		switch (category) {
			case Category.CHAPTER:
				query = this.db.selectFrom("LiteraryWork");
				break;
			case Category.MOVIE:
				query = this.db.selectFrom("Movie");
				break;
			case Category.VIDEO:
				query = this.db.selectFrom("Video");
				break;
			default:
				throw new Error("Media unsupported.");
		}

		query = query.where("id", "=", id).selectAll().executeTakeFirst();
		const media = await query;

		return media;
	}

	public async findChannelByExternalId(externalId: string): Promise<VideoChannelSelectable | undefined> {
		const channel = await this.db
			.selectFrom("VideoChannel")
			.where("externalId", "=", externalId)
			.selectAll()
			.executeTakeFirst();

		return channel;
	}

	public async findChannelByUrl(url: string): Promise<VideoChannelSelectable | undefined> {
		const channel = await this.db
			.selectFrom("VideoChannel")
			.where("link", "=", url)
			.selectAll()
			.executeTakeFirst();

		return channel;
	}

	public async findChapter(sourceId: string, number: number): Promise<LiteraryWorkChapter | undefined> {
		const chapter = await this.db
			.selectFrom("LiteraryWorkChapter")
			.where(eb =>
				eb.and({
					number,
					sourceId,
				}),
			)
			.selectAll()
			.executeTakeFirst();

		return chapter;
	}

	public async findVideoByUrl(url: string): Promise<VideoSelectable | undefined> {
		const video = await this.db.selectFrom("Video").where("link", "=", url).selectAll().executeTakeFirst();

		return video;
	}

	public async updateChannel(id: string, data: VideoChannelUpdateable): Promise<void> {
		await this.db.updateTable("VideoChannel").set(data).where("id", "=", id).execute();
	}
}
