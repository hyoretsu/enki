import { beforeEach, describe, expect, test } from "bun:test";
import { CreateMedia } from "@/modules/media/useCases/CreateMedia";
import { TrackMedia } from "@/modules/media/useCases/TrackMedia";
import { mediaRepository, resetData, seedUser, usersRepository } from "@/shared/tests/factories";
import { Category, LiteraryWorkType } from "@/shared/types";
import { GetStatistics } from "../useCases/GetStatistics";

const createMedia = new CreateMedia(mediaRepository);
const trackMedia = new TrackMedia(mediaRepository, usersRepository);
const getStatistics = new GetStatistics(usersRepository);

beforeEach(async () => {
	await resetData();
});

describe("GetStatistics (e2e)", () => {
	test("returns all zeros for a user with no tracked media", async () => {
		const userId = await seedUser("stats-empty");

		const { totalTime } = await getStatistics.execute({ userId });

		expect(totalTime).toEqual([0, 0, 0, 0]);
	});

	test("aggregates watch time from a tracked movie", async () => {
		const userId = await seedUser("stats-movie");
		const movieId = await createMedia.execute({
			category: Category.MOVIE,
			duration: "PT2M",
			title: { default: ["Film"] },
		});

		await trackMedia.execute({ category: Category.MOVIE, mediaId: movieId, userId });

		const { totalTime } = await getStatistics.execute({ userId });
		// 120s → 0d 0h 2m 0s
		expect(totalTime).toEqual([0, 0, 2, 0]);
	});

	test("scopes the aggregate to the requested categories", async () => {
		const userId = await seedUser("stats-scope");
		const movieId = await createMedia.execute({
			category: Category.MOVIE,
			duration: "PT2M",
			title: { default: ["Film"] },
		});
		await trackMedia.execute({ category: Category.MOVIE, mediaId: movieId, userId });

		const { totalTime } = await getStatistics.execute({
			categories: [LiteraryWorkType.NOVEL],
			userId,
		});

		expect(totalTime).toEqual([0, 0, 0, 0]);
	});
});
