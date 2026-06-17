import { describe, expect, test } from "bun:test";
import { getShortUrl } from "./getShortUrl";

describe("getShortUrl", () => {
	test("normalizes a youtube.com watch URL to a youtu.be short link", () => {
		expect(getShortUrl("https://www.youtube.com/watch?v=abc123")).toBe("https://youtu.be/abc123");
	});

	test("keeps a youtu.be short link's path", () => {
		expect(getShortUrl("https://youtu.be/xyz789")).toBe("https://youtu.be/xyz789");
	});

	test("returns an empty string for a non-youtube URL", () => {
		expect(getShortUrl("https://example.com/video/1")).toBe("");
	});
});
