import type { ListMediaDTO } from "@/shared/dtos";
import type { MediaRepository } from "@/shared/repositories";
import type { Media } from "@/shared/types";

export class ListMedia {
	constructor(private readonly mediaRepository: MediaRepository) {}

	public async execute({ category, ...filters }: ListMediaDTO): Promise<Media[]> {
		let media: Media[];

		if (filters.mediaId) {
			media = await this.mediaRepository.find(false, category, filters);
		} else {
			media = await this.mediaRepository.find(true, category, filters);
		}

		return media;
	}
}
