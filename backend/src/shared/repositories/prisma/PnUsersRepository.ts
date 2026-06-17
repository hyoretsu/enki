import type { TrackMediaUserDTO, TrackVideoGamePlaythroughDTO } from "@/shared/dtos";
import type { UsersRepository } from "@/shared/repositories";
import { Category, type User } from "@/shared/types";
import { sum } from "@hyoretsu/utils";
import type { Db } from "sql";

const int4 = { codecId: "pg/int4@1", nullable: true } as const;

/** Erases the branded `Char<36>` id codec type so plain strings can be used in filters. */
const uuid = (value: string) => value as never;

export class PnUsersRepository implements UsersRepository {
	constructor(private readonly db: Db) {}

	public async findByEmail(email: string): Promise<User | null | undefined> {
		const user = await this.db.orm.User.where(u => u.email.eq(email)).first();

		return user as User | null;
	}

	public async findById(id: string): Promise<User | null | undefined> {
		const user = await this.db.orm.User.first({ id: uuid(id) });

		return user as User | null;
	}

	public async getTimeSpent(id: string, categories?: string[]): Promise<number> {
		const { sql } = this.db;
		const runtime = this.db.runtime();

		const queries: PromiseLike<readonly Record<string, unknown>[]>[] = [];

		if (!categories || categories.includes(Category.LITERARY_WORK)) {
			const plan = sql.userChapter
				.innerJoin(sql.literaryWorkChapter, (f, fns) =>
					fns.eq(f.userChapter.chapterId, f.literaryWorkChapter.id),
				)
				.innerJoin(sql.literaryWork, (f, fns) => fns.eq(f.literaryWorkChapter.sourceId, f.literaryWork.id))
				.select("readingTime", (f, fns) =>
					fns.sum(
						fns.raw`COALESCE(${f.userChapter.timeSpent}, ${f.literaryWorkChapter.averageTime}, ${f.literaryWork.averageTime})`.returns(
							int4,
						),
					),
				)
				.where((f, fns) => fns.eq(f.userChapter.userId, id))
				.build();

			queries.push(runtime.execute(plan) as PromiseLike<readonly Record<string, unknown>[]>);
		}
		if (!categories || categories.includes(Category.MOVIE)) {
			const plan = sql.userMovie
				.innerJoin(sql.movie, (f, fns) => fns.eq(f.userMovie.movieId, f.movie.id))
				.select("watchTime", (f, fns) => fns.sum(f.movie.duration))
				.where((f, fns) => fns.eq(f.userMovie.userId, id))
				.build();

			queries.push(runtime.execute(plan) as PromiseLike<readonly Record<string, unknown>[]>);
		}
		if (!categories || categories.includes(Category.VIDEO)) {
			const plan = sql.userVideo
				.innerJoin(sql.video, (f, fns) => fns.eq(f.userVideo.videoId, f.video.id))
				.select("watchTime", (f, fns) =>
					fns.sum(fns.raw`COALESCE(${f.userVideo.progress}, ${f.video.duration})`.returns(int4)),
				)
				.where((f, fns) => fns.eq(f.userVideo.userId, id))
				.build();

			queries.push(runtime.execute(plan) as PromiseLike<readonly Record<string, unknown>[]>);
		}
		if (!categories || categories.includes(Category.VIDEO_GAME)) {
			const plan = sql.userVideoGame
				.select("playTime", (f, fns) =>
					fns.sum(fns.raw`COALESCE(${f.timeSpent}, 0) - COALESCE(${f.offset}, 0)`.returns(int4)),
				)
				.where((f, fns) => fns.eq(f.userId, id))
				.build();

			queries.push(runtime.execute(plan) as PromiseLike<readonly Record<string, unknown>[]>);
		}

		const times = await Promise.all(queries);
		const timeSpent = sum(times.map(([row]) => Number(Object.values(row ?? {})[0]) || 0));

		return timeSpent;
	}

	public async track({
		bookmarked,
		category,
		mediaId,
		timeSpent,
		...data
	}: TrackMediaUserDTO): Promise<void> {
		const { orm } = this.db;

		switch (category) {
			case Category.CHAPTER:
				await orm.UserChapter.create({
					...data,
					bookmarked: bookmarked ?? false,
					chapterId: mediaId,
					...(timeSpent ? { timeSpent: Number(timeSpent) } : {}),
				});
				break;
			case Category.MOVIE:
				await orm.UserMovie.create({
					...data,
					bookmarked: bookmarked ?? false,
					movieId: mediaId,
					...(timeSpent ? { progress: Number(timeSpent) } : {}),
				});
				break;
			case Category.VIDEO:
				await orm.UserVideo.create({
					...data,
					bookmarked: bookmarked ?? false,
					...(timeSpent ? { progress: Number(timeSpent) } : {}),
					videoId: mediaId,
				});
				break;
			case Category.VIDEO_GAME:
				await orm.UserVideoGame.create({
					...data,
					bookmarked: bookmarked ?? false,
					...(timeSpent ? { timeSpent: Number(timeSpent) } : {}),
					videoGameId: mediaId,
				});
				break;
			default:
				throw new Error("Media unsupported.");
		}
	}

	/** Upserts the user's playthrough of a run kind, keyed by (userId, playthroughId). */
	public async trackPlaythrough({ playthroughId, timeSpent, userId }: TrackVideoGamePlaythroughDTO): Promise<void> {
		const { orm } = this.db;

		const existing = await orm.UserVideoGamePlaythrough.first({ playthroughId: uuid(playthroughId), userId: uuid(userId) });

		if (existing) {
			if (timeSpent !== undefined) {
				await orm.UserVideoGamePlaythrough.where(run => run.id.eq(existing.id)).update({ timeSpent });
			}

			return;
		}

		await orm.UserVideoGamePlaythrough.create({
			playthroughId,
			userId,
			...(timeSpent !== undefined ? { timeSpent } : {}),
		});
	}
}
