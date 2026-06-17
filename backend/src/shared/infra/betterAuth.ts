import { betterAuth } from "better-auth";
import { Pool } from "pg";

const algorithm = "argon2id";

export const auth = betterAuth({
	advanced: {
		database: {
			generateId: () => crypto.randomUUID(),
		},
	},
	basePath: "/auth",
	database: new Pool({
		connectionString: process.env.DATABASE_URL,
		max: 5,
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		password: {
			hash: password => Bun.password.hash(password, { algorithm }),
			// No explicit algorithm so hashes migrated from the legacy bcrypt users still verify.
			verify: ({ hash, password }) => Bun.password.verify(password, hash),
		},
	},
	trustedOrigins: (process.env.WEB_URL || "http://localhost:5173").split(","),
});

export type Session = typeof auth.$Infer.Session;
