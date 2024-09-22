import type { GetStatisticsDTO, UsersRepository } from "@enki/domain";
import { timeConversion } from "@hyoretsu/utils";

export interface Statistics {
	totalTime: number[];
}

const dayInSeconds = timeConversion(1, "days", "seconds");
const hourInSeconds = timeConversion(1, "hours", "seconds");
const minuteInSeconds = timeConversion(1, "minutes", "seconds");

export class GetStatistics {
	constructor(private readonly usersRepository: UsersRepository) {}

	public async execute({ categories, userId }: GetStatisticsDTO): Promise<Statistics> {
		let timeSpent = await this.usersRepository.getTimeSpent(userId, categories);

		const totalTime: number[] = [];

		totalTime.push(Math.floor(timeSpent / dayInSeconds));
		timeSpent = timeSpent % dayInSeconds;
		totalTime.push(Math.floor(timeSpent / hourInSeconds));
		timeSpent = timeSpent % hourInSeconds;
		totalTime.push(Math.floor(timeSpent / minuteInSeconds));
		timeSpent = timeSpent % minuteInSeconds;
		totalTime.push(timeSpent);

		return {
			totalTime,
		};
	}
}
