import type { ListMediaDTO, Media, MediaRepository } from "@enki/domain";

export class ListMedia {
	constructor(private readonly mediaRepository: MediaRepository) {}

	public async execute({ category, ...filters }: ListMediaDTO): Promise<Media[]> {
		const media = await this.mediaRepository.find(true, category, filters);

		return media;
	}
}
