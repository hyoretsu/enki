import type { CreateUserDTO, UsersRepository } from "@enki/domain";
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

	public async getTimeSpent(email: string, categories?: string[]): Promise<number> {
		const queries: Promise<Record<string, string | number | bigint> | undefined>[] = [];

		if (!categories || categories.includes("chapters")) {
			queries.push(
				this.db
					.selectFrom("User as u")
					.where("u.email", "=", email)
					.innerJoin("UserChapter as uc", "uc.email", "u.email")
					.leftJoin("LiteraryWorkChapter as lwc", "lwc.id", "uc.chapterId")
					.select(({ fn }) => fn.sum(fn.coalesce("uc.timeSpent", "lwc.readingTime")).as("readingTime"))
					.executeTakeFirst(),
			);
		}
		if (!categories || categories.includes("videos")) {
			queries.push(
				this.db
					.selectFrom("User as u")
					.where("u.email", "=", email)
					.innerJoin("UserVideo as uv", "uv.email", "u.email")
					.leftJoin("Video as v", "v.id", "uv.videoId")
					.select(({ fn }) => fn.sum(fn.coalesce("uv.watchTime", "v.duration")).as("watchTime"))
					.executeTakeFirst(),
			);
		}

		const times = await Promise.all(queries);
		const timeSpent = sum(times.map(time => Number(Object.values(time!)[0])));

		return timeSpent;
	}
}
