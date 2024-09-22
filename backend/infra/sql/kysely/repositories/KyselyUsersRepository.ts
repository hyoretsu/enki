import { Category, type CreateUserDTO, type TrackMediaUserDTO, type UsersRepository } from "@enki/domain";
import { sum } from "@hyoretsu/utils";
import type { Kysely } from "kysely";
import type { UserSelectable } from "../entities";
import type { DB } from "../types";

export class KyselyUsersRepository implements UsersRepository {
	constructor(private readonly db: Kysely<DB>) {}

	public async create(data: CreateUserDTO): Promise<UserSelectable> {
		const user = await this.db.insertInto("User").values(data).returningAll().executeTakeFirstOrThrow();

		return user;
	}

	public async findByEmail(email: string): Promise<UserSelectable | null | undefined> {
		const user = await this.db.selectFrom("User").selectAll().where("email", "=", email).executeTakeFirst();

		return user;
	}

	public async findById(id: string): Promise<UserSelectable | null | undefined> {
		const user = await this.db.selectFrom("User").selectAll().where("id", "=", id).executeTakeFirst();

		return user;
	}

	public async getTimeSpent(id: string, categories?: string[]): Promise<number> {
		const queries: Promise<Record<string, string | number | bigint> | undefined>[] = [];

		const userQuery = this.db.selectFrom("User as u").where("u.id", "=", id);

		if (!categories || categories.includes(Category.LITERARY_WORK)) {
			queries.push(
				userQuery
					.innerJoin("UserChapter as uc", "uc.userId", "u.id")
					.leftJoin("LiteraryWorkChapter as lwc", "lwc.id", "uc.chapterId")
					.leftJoin("LiteraryWork as lw", "lw.id", "lwc.sourceId")
					.select(({ fn }) =>
						fn
							.sum(fn.coalesce(fn.coalesce("uc.timeSpent", "lwc.averageTime"), "lw.averageTime"))
							.as("readingTime"),
					)
					.executeTakeFirst(),
			);
		}
		if (!categories || categories.includes(Category.MOVIE)) {
			queries.push(
				userQuery
					.innerJoin("UserMovie as um", "um.userId", "u.id")
					.leftJoin("Movie as m", "m.id", "um.movieId")
					.select(({ fn }) => fn.sum("m.duration").as("watchTime"))
					.executeTakeFirst(),
			);
		}
		if (!categories || categories.includes(Category.VIDEO)) {
			queries.push(
				userQuery
					.innerJoin("UserVideo as uv", "uv.userId", "u.id")
					.leftJoin("Video as v", "v.id", "uv.videoId")
					.select(({ fn }) => fn.sum(fn.coalesce("uv.timeSpent", "v.duration")).as("watchTime"))
					.executeTakeFirst(),
			);
		}

		const times = await Promise.all(queries);
		const timeSpent = sum(times.map(time => Number(Object.values(time!)[0])));

		return timeSpent;
	}

	public async track({ category, mediaId, timeSpent, ...data }: TrackMediaUserDTO): Promise<void> {
		switch (category) {
			case Category.CHAPTER:
				await this.db
					.insertInto("UserChapter")
					.values({ ...data, chapterId: mediaId, ...(timeSpent ? { timeSpent: Number(timeSpent) } : {}) })
					.execute();
				break;
			case Category.MOVIE:
				await this.db
					.insertInto("UserMovie")
					.values({ ...data, movieId: mediaId })
					.execute();
				break;
			case Category.VIDEO:
				await this.db
					.insertInto("UserVideo")
					.values({ ...data, timeSpent, videoId: mediaId })
					.execute();
				break;
			default:
				throw new Error("Media unsupported.");
		}
	}
}
