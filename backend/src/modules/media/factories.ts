import { mediaRepository, usersRepository } from "@/shared/infra/sql";
import {
	CreateMedia,
	CreateVideoGamePlaythrough,
	GetVideoGamePlaythroughs,
	ListMedia,
	TrackMedia,
	TrackVideoGamePlaythrough,
} from "./useCases";

export const buildCreateMedia = (): CreateMedia => new CreateMedia(mediaRepository);
export const buildListMedia = (): ListMedia => new ListMedia(mediaRepository);
export const buildTrackMedia = (): TrackMedia => new TrackMedia(mediaRepository, usersRepository);
export const buildCreateVideoGamePlaythrough = (): CreateVideoGamePlaythrough =>
	new CreateVideoGamePlaythrough(mediaRepository);
export const buildGetVideoGamePlaythroughs = (): GetVideoGamePlaythroughs =>
	new GetVideoGamePlaythroughs(mediaRepository);
export const buildTrackVideoGamePlaythrough = (): TrackVideoGamePlaythrough =>
	new TrackVideoGamePlaythrough(usersRepository);
