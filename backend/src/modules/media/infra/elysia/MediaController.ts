import { authGuard } from "@/shared/infra/elysia/guards";
import { Elysia, t } from "elysia";
import {
	CreateMediaBody,
	CreateMediaReturn,
	ListMediaQuery,
	ListMediaReturn,
	TrackMediaBody,
} from "../../dtos";
import {
	buildCreateMedia,
	buildCreateVideoGamePlaythrough,
	buildGetVideoGamePlaythroughs,
	buildListMedia,
	buildTrackMedia,
	buildTrackVideoGamePlaythrough,
} from "../../factories";

const createMedia = buildCreateMedia();
const listMedia = buildListMedia();
const trackMedia = buildTrackMedia();
const createVideoGamePlaythrough = buildCreateVideoGamePlaythrough();
const getVideoGamePlaythroughs = buildGetVideoGamePlaythroughs();
const trackVideoGamePlaythrough = buildTrackVideoGamePlaythrough();

const VideoGamePlaythroughReturn = t.Object({
	id: t.String(),
	name: t.String(),
	videoGameId: t.String(),
});

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
		// Playthroughs are sub-resources of a video game, so they hang off its id.
		.get(
			"/video-games/:videoGameId/playthroughs",
			({ params }) => getVideoGamePlaythroughs.execute(params.videoGameId),
			{
				detail: { tags: ["Media"] },
				params: t.Object({ videoGameId: t.String() }),
				response: t.Array(VideoGamePlaythroughReturn),
			},
		)
		.post(
			"/video-games/:videoGameId/playthroughs",
			({ params, body }) => createVideoGamePlaythrough.execute({ ...body, videoGameId: params.videoGameId }),
			{
				detail: { tags: ["Media"] },
				params: t.Object({ videoGameId: t.String() }),
				body: t.Object({ name: t.Optional(t.String()) }),
				response: t.Object({ id: t.String() }),
			},
		)
		.resolve(({ request }) => authGuard(request.headers))
		.post("/track", ({ body, userId }) => trackMedia.execute({ ...body, userId }), {
			detail: {
				tags: ["Media"],
			},
			body: TrackMediaBody,
			response: t.Void(),
		})
		.post(
			"/playthroughs/:playthroughId/track",
			({ params, body, userId }) =>
				trackVideoGamePlaythrough.execute({ ...body, playthroughId: params.playthroughId, userId }),
			{
				detail: { tags: ["Media"] },
				params: t.Object({ playthroughId: t.String() }),
				body: t.Object({ timeSpent: t.Optional(t.Integer()) }),
				response: t.Void(),
			},
		),
);
