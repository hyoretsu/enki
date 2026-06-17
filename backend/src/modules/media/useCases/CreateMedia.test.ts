import { describe, expect, mock, test } from "bun:test";
import { HttpException } from "@/shared/errors";
import { MockMediaRepository } from "@/shared/repositories/mock";
import { Category, LiteraryWorkType } from "@/shared/types";

// Mock the YouTube client before importing CreateMedia so the VIDEO branch never hits the
// network. A dynamic import below guarantees CreateMedia binds the mocked module.
mock.module("@/shared/clients", () => ({
	youtubeClient: {
		channels: {
			list: async () => ({ data: { items: [{ snippet: { customUrl: "@chan", title: "Channel" } }] } }),
		},
		videos: {
			list: async () => ({
				data: {
					items: [
						{
							contentDetails: { duration: "PT2M30S" },
							snippet: { channelId: "ext-1", publishedAt: "2024-01-01T00:00:00Z", title: "Video" },
						},
					],
				},
			}),
		},
	},
}));

const { CreateMedia } = await import("./CreateMedia");

function setup() {
	const repo = new MockMediaRepository();
	return { createMedia: new CreateMedia(repo), repo };
}

describe("CreateMedia", () => {
	test("creates a chapter and rejects a duplicate", async () => {
		const { createMedia, repo } = setup();

		const id = await createMedia.execute({ category: Category.CHAPTER, number: 1, sourceId: "work-1" });
		expect(repo.media.find(m => m.id === id)?.category).toBe(Category.CHAPTER);

		await expect(
			createMedia.execute({ category: Category.CHAPTER, number: 1, sourceId: "work-1" }),
		).rejects.toBeInstanceOf(HttpException);
	});

	test("creates a literary work and its current chapters", async () => {
		const { createMedia, repo } = setup();

		const id = await createMedia.execute({
			category: Category.LITERARY_WORK,
			currentChapters: 3,
			title: { default: ["Work"] },
			type: LiteraryWorkType.NOVEL,
		});

		expect(repo.media.find(m => m.id === id)?.category).toBe(Category.LITERARY_WORK);
		expect(repo.chapters.filter(c => c.sourceId === id)).toHaveLength(3);
	});

	test("creates a movie, converting the ISO-8601 duration to seconds", async () => {
		const { createMedia, repo } = setup();

		const id = await createMedia.execute({
			category: Category.MOVIE,
			duration: "PT1H1M1S",
			title: { default: ["Film"] },
		});

		expect(repo.media.find(m => m.id === id)?.duration).toBe(3661);
	});

	test("creates a video game", async () => {
		const { createMedia, repo } = setup();

		const id = await createMedia.execute({ category: Category.VIDEO_GAME, title: { default: ["Game"] } });

		expect(repo.media.find(m => m.id === id)?.category).toBe(Category.VIDEO_GAME);
	});

	test("creates a video and its channel from the YouTube API", async () => {
		const { createMedia, repo } = setup();

		const id = await createMedia.execute({
			category: Category.VIDEO,
			link: "https://www.youtube.com/watch?v=abc123",
		});

		const video = repo.media.find(m => m.id === id);
		expect(video?.category).toBe(Category.VIDEO);
		expect(video?.duration).toBe(150);
		expect(repo.channels).toHaveLength(1);
		expect(repo.channels[0].externalId).toBe("ext-1");
	});

	test("rejects a duplicate video link", async () => {
		const { createMedia } = setup();

		await createMedia.execute({ category: Category.VIDEO, link: "https://www.youtube.com/watch?v=abc123" });

		await expect(
			createMedia.execute({ category: Category.VIDEO, link: "https://www.youtube.com/watch?v=abc123" }),
		).rejects.toBeInstanceOf(HttpException);
	});
});
