import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { Pool } from "pg";
import { name as appName } from "../../../../package.json";

const algorithm = "argon2id";

// Cookie names are prefixed with the monorepo package name so every project under hyoretsu.com
// gets its own session cookie (`enki.session_token`) instead of colliding on the shared parent
// domain below.
const cookiePrefix = appName;

// Cross-subdomain auth: the session cookie is scoped to the shared parent domain so the web app
// (enki.hyoretsu.com) reads the session set by the API (enki-api.hyoretsu.com). The parent is the
// registrable domain. When the host carries a "com" label the public suffix is "com" plus
// whatever follows (com, com.br), so we keep the label right before "com" through the end
// (enki.com.br → .enki.com.br, enki.hyoretsu.com → .hyoretsu.com). Otherwise the TLD is the last
// label (.app, .fyi) and the last two labels are the registrable domain. A single-label host
// (localhost) has no shared parent, so cross-subdomain stays disabled in local dev.
const webHost = new URL((process.env.WEB_URL || "http://localhost:3000").split(",")[0]).hostname;
const labels = webHost.split(".");
const comIndex = labels.indexOf("com");
const registrable = comIndex > 0 ? labels.slice(comIndex - 1) : labels.slice(-2);
const cookieDomain = registrable.length >= 2 ? `.${registrable.join(".")}` : undefined;

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
		cookiePrefix,
		...(cookieDomain && {
			crossSubDomainCookies: { domain: cookieDomain, enabled: true },
		}),
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
