import type { CreateVideoGamePlaythroughDTO } from "@/shared/dtos";
import type { MediaRepository } from "@/shared/repositories";

export class CreateVideoGamePlaythrough {
	constructor(private readonly mediaRepository: MediaRepository) {}

	public execute(data: CreateVideoGamePlaythroughDTO): Promise<{ id: string }> {
		return this.mediaRepository.createVideoGamePlaythrough(data);
	}
}
