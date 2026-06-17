import type { MediaRepository } from "@/shared/repositories";
import type { VideoGamePlaythrough } from "@/shared/types";

export class GetVideoGamePlaythroughs {
	constructor(private readonly mediaRepository: MediaRepository) {}

	public execute(videoGameId: string): Promise<VideoGamePlaythrough[]> {
		return this.mediaRepository.findVideoGamePlaythroughs(videoGameId);
	}
}
