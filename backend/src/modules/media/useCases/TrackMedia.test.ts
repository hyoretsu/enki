import { describe, expect, mock, test } from "bun:test";
import { HttpException } from "@/shared/errors";
import { MockMediaRepository, MockUsersRepository } from "@/shared/repositories/mock";
import { Category } from "@/shared/types";

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
							contentDetails: { duration: "PT1M" },
							snippet: { channelId: "ext-1", publishedAt: "2024-01-01T00:00:00Z", title: "Video" },
						},
					],
				},
			}),
		},
	},
}));

const { TrackMedia } = await import("./TrackMedia");

function setup() {
	const media = new MockMediaRepository();
	const users = new MockUsersRepository();
	users.seedUser({ id: "user-1" });
	return { media, trackMedia: new TrackMedia(media, users), users };
}

describe("TrackMedia", () => {
	test("rejects an unknown user", async () => {
		const { media, trackMedia } = setup();
		const { id } = await media.create({ category: Category.MOVIE, title: { default: ["M"] } } as never);

		await expect(
			trackMedia.execute({ category: Category.MOVIE, mediaId: id, userId: "ghost" }),
		).rejects.toBeInstanceOf(HttpException);
	});

	test("tracks an existing movie", async () => {
		const { media, trackMedia, users } = setup();
		const { id } = await media.create({ category: Category.MOVIE, title: { default: ["M"] } } as never);

		await trackMedia.execute({ category: Category.MOVIE, mediaId: id, userId: "user-1" });

		expect(users.tracked).toHaveLength(1);
		expect(users.tracked[0].mediaId).toBe(id);
		expect(users.tracked[0].category).toBe(Category.MOVIE);
	});

	test("tracks a video game, converting the offset to seconds", async () => {
		const { media, trackMedia, users } = setup();
		const { id } = await media.create({ category: Category.VIDEO_GAME, title: { default: ["G"] } } as never);

		await trackMedia.execute({
			category: Category.VIDEO_GAME,
			mediaId: id,
			offset: "PT1M",
			userId: "user-1",
		} as never);

		expect((users.tracked[0] as Record<string, any>).offset).toBe("60");
	});

	test("creates the chapter on first track of a work", async () => {
		const { media, trackMedia, users } = setup();
		const { id: workId } = await media.create({
			category: Category.LITERARY_WORK,
			title: { default: ["W"] },
		} as never);

		await trackMedia.execute({
			category: Category.CHAPTER,
			mediaId: workId,
			number: 1,
			timeSpent: "PT1M",
			userId: "user-1",
		} as never);

		expect(media.chapters).toHaveLength(1);
		expect(users.tracked[0].mediaId).toBe(media.chapters[0].id);
	});

	test("reuses an already-created chapter", async () => {
		const { media, trackMedia, users } = setup();
		const { id: workId } = await media.create({
			category: Category.LITERARY_WORK,
			title: { default: ["W"] },
		} as never);
		await media.create({ category: Category.CHAPTER, number: 2, sourceId: workId } as never);

		await trackMedia.execute({
			category: Category.CHAPTER,
			mediaId: workId,
			number: 2,
			timeSpent: "PT30S",
			userId: "user-1",
		} as never);

		expect(media.chapters).toHaveLength(1);
		expect(users.tracked[0].mediaId).toBe(media.chapters[0].id);
	});
});
