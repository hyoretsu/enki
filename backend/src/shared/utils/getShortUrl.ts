export const getShortUrl = (url: string): string => {
	const parsedUrl = new URL(url);
	let shortUrl = "";

	if (parsedUrl.host.includes("youtu")) {
		shortUrl = "https://youtu.be";

		if (parsedUrl.host.includes("youtube.com")) {
			shortUrl += `/${parsedUrl.searchParams.get("v")}`;
		} else {
			shortUrl += parsedUrl.pathname;
		}
	}

	return shortUrl;
};
