import {
	Category,
	HttpException,
	type MediaRepository,
	type TrackMediaDTO,
	type UsersRepository,
} from "@enki/domain";
import { StatusCodes } from "http-status-codes";
import { parse, toSeconds } from "iso8601-duration";
import { getShortUrl } from "~/utils";
import { CreateMedia } from "./CreateMedia";

export class TrackMedia {
	private readonly createMedia: CreateMedia;

	constructor(
		private readonly mediaRepository: MediaRepository,
		private readonly usersRepository: UsersRepository,
	) {
		this.createMedia = new CreateMedia(this.mediaRepository);
	}

	public async execute({ category, email, link, mediaId, number, ...data }: TrackMediaDTO): Promise<void> {
		if (!data.when) {
			data.when = new Date();
		}

		const existingUser = await this.usersRepository.findByEmail(email);
		if (!existingUser) {
			throw new HttpException("There is no user with this email.", StatusCodes.NOT_FOUND);
		}

		switch (category) {
			case Category.CHAPTER: {
				const work = await this.mediaRepository.findById(category, mediaId);
				if (!work) {
					throw new HttpException("The work you want to track doesn't exist.", StatusCodes.NOT_FOUND);
				}

				const existingChapter = await this.mediaRepository.findChapter(mediaId, number);
				if (!existingChapter) {
					mediaId = await this.createMedia.execute({
						category,
						noCheck: true,
						number,
						sourceId: mediaId,
					});
				} else {
					mediaId = existingChapter.id;
				}

				break;
			}
			case Category.MOVIE: {
				const media = await this.mediaRepository.findById(category, mediaId);
				if (!media) {
					throw new HttpException("The movie you want to track doesn't exist.", StatusCodes.NOT_FOUND);
				}

				mediaId = media.id;

				break;
			}
			case Category.VIDEO: {
				if (link) {
					const shortUrl = getShortUrl(link);

					const existingVideo = await this.mediaRepository.findVideoByUrl(shortUrl);
					if (!existingVideo) {
						const videoId = await this.createMedia.execute({
							category,
							noCheck: true,
							link: shortUrl,
						});

						mediaId = videoId;
					} else {
						mediaId = existingVideo.id;
					}
				}
				break;
			}
			default:
				throw new HttpException("Unsupported media.", StatusCodes.BAD_REQUEST);
		}

		if (data.timeSpent) {
			data.timeSpent = String(toSeconds(parse(data.timeSpent)));
		}

		await this.usersRepository.track({
			...data,
			category,
			email,
			mediaId,
		});
	}
}
