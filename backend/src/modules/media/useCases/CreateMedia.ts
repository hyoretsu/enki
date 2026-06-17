import { youtubeClient } from "@/shared/clients";
import type { CreateMediaDTO } from "@/shared/dtos";
import { HttpException } from "@/shared/errors";
import type { MediaRepository } from "@/shared/repositories";
import { Category } from "@/shared/types";
import { getShortUrl } from "@/shared/utils";
import { StatusCodes } from "http-status-codes";
import { parse, toSeconds } from "iso8601-duration";

export class CreateMedia {
	constructor(private readonly mediaRepository: MediaRepository) {}

	public async execute({ noCheck, ...data }: CreateMediaDTO): Promise<string> {
		let mediaId: string;

		switch (data.category) {
			case Category.CHAPTER: {
				const { number, sourceId, ...rest } = data;

				if (!noCheck) {
					const existingChapter = await this.mediaRepository.findChapter(sourceId, number);

					if (existingChapter) {
						throw new HttpException("This chapter already exists.", StatusCodes.CONFLICT);
					}
				}

				const { id } = await this.mediaRepository.create({
					...rest,
					sourceId,
					number,
				});

				mediaId = id;
				break;
			}
			case Category.LITERARY_WORK: {
				const { currentChapters, tags, ...rest } = data;

				const { id } = await this.mediaRepository.create({ ...rest, tags: tags ?? [] });

				if (currentChapters) {
					await this.mediaRepository.createChapters(id, currentChapters);
				}

				mediaId = id;
				break;
			}
			case Category.MOVIE: {
				const { duration, ...rest } = data;

				const { id } = await this.mediaRepository.create({
					...rest,
					duration: duration ? toSeconds(parse(duration)) : undefined,
				});

				mediaId = id;
				break;
			}
			case Category.VIDEO: {
				const shortUrl = getShortUrl(data.link);

				if (!noCheck) {
					const existingVideo = await this.mediaRepository.findVideoByUrl(shortUrl);

					if (existingVideo) {
						throw new HttpException("A video with this link already exists.", StatusCodes.CONFLICT);
					}
				}

				const video = (
					await youtubeClient.videos.list({
						id: [shortUrl.split("/").at(-1)!],
						part: ["contentDetails", "snippet"],
					})
				).data.items![0]!;
				const duration = video.contentDetails!.duration!;
				const { publishedAt, title } = video.snippet! as { publishedAt: string; title: string };
				let channelId = video.snippet!.channelId!;

				let existingChannel = await this.mediaRepository.findChannelByExternalId(channelId);
				if (!existingChannel) {
					const { customUrl: channelUrl, title: channelTitle } = (
						await youtubeClient.channels.list({
							id: [channelId],
							part: ["snippet"],
						})
					).data.items![0]!.snippet! as { customUrl: string; title: string };

					const link = `https://youtube.com/${channelUrl}`;

					existingChannel = await this.mediaRepository.findChannelByUrl(link);
					if (!existingChannel) {
						const channel = await this.mediaRepository.createVideoChannel({
							externalId: channelId,
							link,
							name: channelTitle,
						});

						channelId = channel.id;
					} else {
						await this.mediaRepository.updateChannel(existingChannel.id, { externalId: channelId });

						channelId = existingChannel.id;
					}
				} else {
					channelId = existingChannel.id;
				}

				const { id } = await this.mediaRepository.create({
					category: Category.VIDEO,
					channelId: channelId,
					duration: toSeconds(parse(duration)),
					link: shortUrl,
					releaseDate: new Date(publishedAt),
					title: {
						default: [title],
					},
				});

				mediaId = id;
				break;
			}
			case Category.VIDEO_GAME: {
				const { id } = await this.mediaRepository.create(data);

				mediaId = id;
				break;
			}
			default:
				throw new HttpException("Media unsupported.", StatusCodes.BAD_REQUEST);
		}

		return mediaId;
	}
}
