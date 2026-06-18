import type { TrackVideoGamePlaythroughDTO } from "@/shared/dtos";
import type { UsersRepository } from "@/shared/repositories";

export class TrackVideoGamePlaythrough {
	constructor(private readonly usersRepository: UsersRepository) {}

	public execute(data: TrackVideoGamePlaythroughDTO): Promise<void> {
		return this.usersRepository.trackPlaythrough(data);
	}
}
