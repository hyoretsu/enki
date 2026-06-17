import { authGuard } from "@/shared/infra/elysia/guards";
import { Elysia, t } from "elysia";
import {
	CreateMediaBody,
	CreateMediaReturn,
	ListMediaQuery,
	ListMediaReturn,
	TrackMediaBody,
} from "../../dtos";
import { buildCreateMedia, buildListMedia, buildTrackMedia } from "../../factories";

const createMedia = buildCreateMedia();
const listMedia = buildListMedia();
const trackMedia = buildTrackMedia();

export const MediaController = new Elysia().group("/media", app =>
	app
		.get("/", ({ query }) => listMedia.execute(query), {
			detail: {
				tags: ["Media"],
			},
			query: ListMediaQuery,
			response: ListMediaReturn,
		})
		.post("/", ({ body }) => createMedia.execute(body), {
			detail: {
				tags: ["Media"],
			},
			body: CreateMediaBody,
			response: CreateMediaReturn,
		})
		.resolve(({ request }) => authGuard(request.headers))
		.post("/track", ({ body, userId }) => trackMedia.execute({ ...body, userId }), {
			detail: {
				tags: ["Media"],
			},
			body: TrackMediaBody,
			response: t.Void(),
		}),
);
