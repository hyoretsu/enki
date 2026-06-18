import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { Pool } from "pg";

const algorithm = "argon2id";

// Google sign-in is only wired when credentials are present, so the server still boots without
// them. It requests the Drive appData scope (offline) so the client can two-way sync its local
// database to the user's Drive — the premium feature behind optional auth.
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const socialProviders =
	GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
		? {
				google: {
					accessType: "offline" as const,
					clientId: GOOGLE_CLIENT_ID,
					clientSecret: GOOGLE_CLIENT_SECRET,
					prompt: "consent" as const,
					scope: ["https://www.googleapis.com/auth/drive.appdata"],
				},
			}
		: undefined;

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
	// Exposes auth.api.generateOpenAPISchema(), merged into the Scalar docs below.
	plugins: [openAPI()],
	socialProviders,
	trustedOrigins: (process.env.WEB_URL || "http://localhost:5173").split(","),
});

export type Session = typeof auth.$Infer.Session;
