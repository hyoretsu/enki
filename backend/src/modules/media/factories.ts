import { mediaRepository, usersRepository } from "@/shared/infra/sql";
import { CreateMedia, ListMedia, TrackMedia } from "./useCases";

export const buildCreateMedia = (): CreateMedia => new CreateMedia(mediaRepository);
export const buildListMedia = (): ListMedia => new ListMedia(mediaRepository);
export const buildTrackMedia = (): TrackMedia => new TrackMedia(mediaRepository, usersRepository);
