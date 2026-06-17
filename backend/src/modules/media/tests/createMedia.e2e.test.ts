import { beforeEach, describe, expect, test } from "bun:test";
import { HttpException } from "@/shared/errors";
import { mediaRepository, resetData } from "@/shared/tests/factories";
import { Category, LiteraryWorkType } from "@/shared/types";
import { CreateMedia } from "../useCases/CreateMedia";

const createMedia = new CreateMedia(mediaRepository);

beforeEach(async () => {
	await resetData();
});

describe("CreateMedia (e2e)", () => {
	test("persists a literary work", async () => {
		const id = await createMedia.execute({
			category: Category.LITERARY_WORK,
			tags: [],
			title: { default: ["The Work"] },
			type: LiteraryWorkType.NOVEL,
		});

		const stored = await mediaRepository.findById(Category.LITERARY_WORK, id);
		expect(stored?.id).toBe(id);
	});

	test("persists a movie with the parsed duration", async () => {
		const id = await createMedia.execute({
			category: Category.MOVIE,
			duration: "PT1H30M",
			title: { default: ["The Movie"] },
		});

		const stored = await mediaRepository.findById(Category.MOVIE, id);
		expect(stored?.duration).toBe(5400);
	});

	test("rejects a duplicate chapter", async () => {
		const workId = await createMedia.execute({
			category: Category.LITERARY_WORK,
			tags: [],
			title: { default: ["Work"] },
			type: LiteraryWorkType.NOVEL,
		});

		await createMedia.execute({ category: Category.CHAPTER, number: 1, sourceId: workId });

		await expect(
			createMedia.execute({ category: Category.CHAPTER, number: 1, sourceId: workId }),
		).rejects.toBeInstanceOf(HttpException);
	});
});
