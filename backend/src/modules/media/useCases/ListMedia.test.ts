import { describe, expect, test } from "bun:test";
import { MockMediaRepository } from "@/shared/repositories/mock";
import { Category } from "@/shared/types";
import { ListMedia } from "./ListMedia";

function setup() {
	const repo = new MockMediaRepository();
	const listMedia = new ListMedia(repo);
	return { listMedia, repo };
}

describe("ListMedia", () => {
	test("does a shallow search across categories when no mediaId filter", async () => {
		const { listMedia, repo } = setup();
		await repo.create({ category: Category.MOVIE, title: { default: ["A"] } } as never);
		await repo.create({ category: Category.VIDEO_GAME, title: { default: ["B"] } } as never);

		const result = await listMedia.execute({});

		expect(result).toHaveLength(2);
	});

	test("filters by category", async () => {
		const { listMedia, repo } = setup();
		await repo.create({ category: Category.MOVIE, title: { default: ["A"] } } as never);
		await repo.create({ category: Category.VIDEO_GAME, title: { default: ["B"] } } as never);

		const result = await listMedia.execute({ category: Category.MOVIE });

		expect(result).toHaveLength(1);
		expect((result[0] as Record<string, any>).category).toBe(Category.MOVIE);
	});

	test("does a deep search (non-shallow) when a mediaId filter is provided", async () => {
		const { listMedia, repo } = setup();
		const { id } = await repo.create({ category: Category.MOVIE, title: { default: ["A"] } } as never);
		await repo.create({ category: Category.MOVIE, title: { default: ["B"] } } as never);

		const result = await listMedia.execute({ category: Category.MOVIE, mediaId: [id] });

		expect(result).toHaveLength(1);
		expect((result[0] as Record<string, any>).id).toBe(id);
	});
});
