import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	basePath: "/auth",
	baseURL: import.meta.env.VITE_API_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;

/** Drive appData scope, requested when linking Google so the app can sync its snapshot. */
export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";

/** Starts the Google OAuth flow, requesting the Drive scope and returning to the profile. */
export function connectGoogleDrive(callbackURL = "/profile") {
	return signIn.social({ provider: "google", scopes: [DRIVE_SCOPE], callbackURL });
}

/** Resolves a fresh Google access token (with the Drive scope) for the signed-in user. */
export async function getDriveToken(): Promise<string> {
	const { data, error } = await authClient.getAccessToken({ providerId: "google" });
	if (error || !data?.accessToken) {
		throw new Error(error?.message ?? "Connect Google Drive first.");
	}
	return data.accessToken;
}
