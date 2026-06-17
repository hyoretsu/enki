import { describe, expect, test } from "bun:test";
import { MockUsersRepository } from "@/shared/repositories/mock";
import { GetStatistics } from "./GetStatistics";

function setup(timeSpent: number) {
	const repo = new MockUsersRepository();
	repo.timeSpent = timeSpent;
	return { getStatistics: new GetStatistics(repo), repo };
}

describe("GetStatistics", () => {
	test("breaks the total time into [days, hours, minutes, seconds]", async () => {
		// 1 day + 2 hours + 3 minutes + 4 seconds.
		const total = 1 * 86400 + 2 * 3600 + 3 * 60 + 4;
		const { getStatistics } = setup(total);

		const { totalTime } = await getStatistics.execute({ userId: "user-1" });

		expect(totalTime).toEqual([1, 2, 3, 4]);
	});

	test("returns all zeros when there is no tracked time", async () => {
		const { getStatistics } = setup(0);

		const { totalTime } = await getStatistics.execute({ userId: "user-1" });

		expect(totalTime).toEqual([0, 0, 0, 0]);
	});

	test("forwards the category filter to the repository", async () => {
		const { getStatistics, repo } = setup(3600);
		let received: string[] | undefined;
		repo.getTimeSpent = async (_id, categories) => {
			received = categories;
			return 3600;
		};

		const { totalTime } = await getStatistics.execute({ categories: ["movie"], userId: "user-1" });

		expect(received).toEqual(["movie"]);
		expect(totalTime).toEqual([0, 1, 0, 0]);
	});
});
