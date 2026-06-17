import { PnMediaRepository } from "@/shared/repositories/prisma/PnMediaRepository";
import { PnUsersRepository } from "@/shared/repositories/prisma/PnUsersRepository";
import { Client } from "pg";
import { db } from "sql";

export { db };

export const mediaRepository = new PnMediaRepository(db);
export const usersRepository = new PnUsersRepository(db);

// Tables holding mutable test state, child-first so a plain DELETE order would also work; we
// TRUNCATE ... CASCADE so order is not load-bearing. Quoted because the schema maps models to
// camelCase table names.
const DATA_TABLES = [
	"userChapter",
	"userMovie",
	"userVideo",
	"userVideoGame",
	"userVideoGameRun",
	"literaryWorkChapter",
	"literaryWork",
	"movie",
	"video",
	"videoGameRun",
	"videoGame",
	"videoChannel",
	"videoPlaylist",
	"session",
	"account",
	"user",
];

/** Wipes all mutable data between e2e tests for a deterministic starting point. */
export async function resetData(): Promise<void> {
	const client = new Client({ connectionString: process.env.DATABASE_URL });
	await client.connect();
	const list = DATA_TABLES.map(t => `"${t}"`).join(", ");
	await client.query(`TRUNCATE ${list} RESTART IDENTITY CASCADE;`);
	await client.end();
}

/** Inserts a minimal user row and returns its id. */
export async function seedUser(id = "user-e2e"): Promise<string> {
	await db.orm.User.create({
		email: `${id}@enki.test`,
		emailVerified: false,
		id: id as never,
		name: "E2E User",
	});

	return id;
}
