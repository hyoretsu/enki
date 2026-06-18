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
import type { Db } from "sql";

/** Erases the branded `Char<36>` id codec type so plain strings can be used in filters. */
const uuid = (value: string) => value as never;

const matchesTitle = (title: unknown, search: string): boolean => {
	if (!title || typeof title !== "object") {
		return false;
	}

	const needle = search.toLowerCase();

	return Object.values(title).some(values =>
		(Array.isArray(values) ? values : [values]).some(
			value => typeof value === "string" && value.toLowerCase().includes(needle),
		),
	);
};

export class PnMediaRepository implements MediaRepository {
	constructor(private readonly db: Db) {}

	public async create(data: CreateMediaDatabaseDTO): Promise<{ id: string }> {
		const { orm } = this.db;

		switch (data.category) {
			case Category.CHAPTER: {
				const { category, ...actualData } = data;

				return orm.LiteraryWorkChapter.select("id").create(actualData);
			}
			case Category.LITERARY_WORK: {
				const { category, ...actualData } = data;

				return orm.LiteraryWork.select("id").create(actualData);
			}
			case Category.MOVIE: {
				const { category, ...actualData } = data;

				return orm.Movie.select("id").create(actualData);
			}
			case Category.VIDEO: {
				const { category, ...actualData } = data;

				return orm.Video.select("id").create(actualData);
			}
			case Category.VIDEO_GAME: {
				const { category, ...actualData } = data;

				return orm.VideoGame.select("id").create(actualData);
			}
			default:
				throw new Error("Media unsupported.");
		}
	}

	public async createChapters(workId: string, chapters: number): Promise<void> {
		await this.db.transaction(async tx => {
			for (let number = 1; number <= chapters; number += 1) {
				await tx.orm.LiteraryWorkChapter.create({ number, sourceId: workId });
			}
		});
	}

	public async createVideoChannel(data: CreateVideoChannelDTO): Promise<VideoChannel> {
		const channel = await this.db.orm.VideoChannel.create(data);

		return channel as VideoChannel;
	}

	public async createVideoGamePlaythrough({ name, videoGameId }: CreateVideoGamePlaythroughDTO): Promise<{ id: string }> {
		return this.db.orm.VideoGamePlaythrough.select("id").create({
			videoGameId,
			...(name !== undefined ? { name } : {}),
		});
	}

	public async find(shallow: boolean, category?: Category, filters?: MediaFilters): Promise<Media[]> {
		const { orm } = this.db;

		let media: Record<string, any>[];

		if (shallow) {
			const categoryQueries: Partial<Record<Category, () => PromiseLike<readonly Record<string, any>[]>>> = {
				[Category.LITERARY_WORK]: () =>
					this.applyFilters(
						orm.LiteraryWork.select("id", "title", "releaseDate", "createdAt"),
						filters,
					).all(),
				[Category.MOVIE]: () =>
					this.applyFilters(orm.Movie.select("id", "title", "releaseDate", "createdAt"), filters).all(),
				[Category.VIDEO]: () =>
					this.applyFilters(orm.Video.select("id", "title", "releaseDate", "createdAt"), filters).all(),
				[Category.VIDEO_GAME]: () =>
					this.applyFilters(orm.VideoGame.select("id", "title", "releaseDate", "createdAt"), filters).all(),
			};

			const searched = category ? [category] : (Object.keys(categoryQueries) as Category[]);

			const results = await Promise.all(
				searched.map(async each => {
					const rows = await categoryQueries[each]!();

					return rows.map(({ createdAt, ...row }) => ({ ...row, category: each, createdAt }));
				}),
			);

			media = results
				.flat()
				.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
				.map(({ createdAt, ...row }) => row);
		} else {
			if (!category) {
				throw new Error("Either do a shallow search or send a category.");
			}

			switch (category) {
				case Category.LITERARY_WORK: {
					const rows = await this.applyFilters(
						orm.LiteraryWork.select(
							"id",
							"title",
							"synopsis",
							"type",
							"tags",
							"ongoing",
							"createdAt",
						).include("chapters", chapter =>
							chapter
								.select("id", "title", "number", "pages", "releaseDate")
								.orderBy(lwc => lwc.number.asc()),
						),
						filters,
					)
						.orderBy(work => work.createdAt.desc())
						.all();

					media = rows.map(({ createdAt, ...row }) => row);
					break;
				}
				case Category.MOVIE: {
					const rows = await this.applyFilters(
						orm.Movie.select("id", "title", "duration", "releaseDate", "createdAt"),
						filters,
					)
						.orderBy(movie => movie.createdAt.desc())
						.all();

					media = rows.map(({ createdAt, ...row }) => row);
					break;
				}
				case Category.VIDEO: {
					const rows = await this.applyFilters(
						orm.Video.select("id", "title", "link", "duration", "channelId", "playlistId", "createdAt"),
						filters,
					)
						.orderBy(video => video.createdAt.desc())
						.all();

					media = rows.map(({ createdAt, ...row }) => row);
					break;
				}
				case Category.VIDEO_GAME: {
					const rows = await this.applyFilters(
						orm.VideoGame.select("id", "title", "releaseDate", "createdAt"),
						filters,
					)
						.orderBy(videoGame => videoGame.createdAt.desc())
						.all();

					media = rows.map(({ createdAt, ...row }) => row);
					break;
				}
				default:
					throw new Error("Media unsupported.");
			}
		}

		if (filters?.title) {
			media = media.filter(each => matchesTitle(each.title, filters.title!));
		}

		return media as Media[];
	}

	public async findById(category: Category, id: string): Promise<Record<string, any> | undefined> {
		const { orm } = this.db;

		let media: Record<string, any> | null;

		switch (category) {
			case Category.CHAPTER:
			case Category.LITERARY_WORK:
				media = await orm.LiteraryWork.first({ id: uuid(id) });
				break;
			case Category.MOVIE:
				media = await orm.Movie.first({ id: uuid(id) });
				break;
			case Category.VIDEO:
				media = await orm.Video.first({ id: uuid(id) });
				break;
			case Category.VIDEO_GAME:
				media = await orm.VideoGame.first({ id: uuid(id) });
				break;
			default:
				throw new Error("Media unsupported.");
		}

		return media ?? undefined;
	}

	public async findChannelByExternalId(externalId: string): Promise<VideoChannel | undefined> {
		const channel = await this.db.orm.VideoChannel.where(vc => vc.externalId.eq(externalId)).first();

		return (channel as VideoChannel) ?? undefined;
	}

	public async findChannelByUrl(url: string): Promise<VideoChannel | undefined> {
		const channel = await this.db.orm.VideoChannel.where(vc => vc.link.eq(url)).first();

		return (channel as VideoChannel) ?? undefined;
	}

	public async findChapter(sourceId: string, number: number): Promise<LiteraryWorkChapter | undefined> {
		const chapter = await this.db.orm.LiteraryWorkChapter.where({ number, sourceId }).first();

		return (chapter as LiteraryWorkChapter) ?? undefined;
	}

	public async findVideoByUrl(url: string): Promise<Video | undefined> {
		const video = await this.db.orm.Video.where(v => v.link.eq(url)).first();

		return (video as unknown as Video) ?? undefined;
	}

	public async findVideoGamePlaythroughs(videoGameId: string): Promise<VideoGamePlaythrough[]> {
		const runs = await this.db.orm.VideoGamePlaythrough.where({ videoGameId: uuid(videoGameId) })
			.orderBy(run => run.name.asc())
			.all();

		return runs as VideoGamePlaythrough[];
	}

	public async updateChannel(id: string, data: UpdateVideoChannelDTO): Promise<void> {
		await this.db.orm.VideoChannel.where({ id: uuid(id) }).update(data);
	}

	private applyFilters<Query extends { where: (predicate: any) => Query }>(
		query: Query,
		filters?: MediaFilters,
	): Query {
		if (filters?.mediaId) {
			query = query.where((media: any) => media.id.in(filters.mediaId!));
		}

		return query;
	}
}
