import { Kysely, PostgresDialect } from "kysely";
import { Pool, types } from "pg";
import { KyselyMediaRepository, KyselyUsersRepository } from "./repositories";
import type { DB } from "./types";

types.setTypeParser(types.builtins.NUMERIC, val => Number(val));

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: process.env.DATABASE_URL,
		max: 25,
		ssl: {
			rejectUnauthorized: false,
		},
	}),
});

export const database = new Kysely<DB>({
	dialect,
});

export type KeyValue = {
	key: string;
	value: string;
};

export const mediaRepository = new KyselyMediaRepository(database);
export const usersRepository = new KyselyUsersRepository(database);
