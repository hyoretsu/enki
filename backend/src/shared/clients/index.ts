import { youtube } from "@googleapis/youtube";

export const youtubeClient = youtube({
	auth: process.env.GOOGLE_API_KEY,
	version: "v3",
});
