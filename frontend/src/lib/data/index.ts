import {
	createMedia,
	getStatistics,
	listMedia,
	trackMedia,
	createVideoGamePlaythrough as repoCreatePlaythrough,
	findVideoGamePlaythroughs as repoFindPlaythroughs,
	trackPlaythrough as repoTrackPlaythrough,
} from "@/lib/local/repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Local-first data layer. These hooks mirror the shape of the Kubb-generated SDK hooks the
// routes used (useGetMedia / usePostMedia / usePostMediaTrack / useGetUsersStats) but read
// and write the on-device SQLite store, so the app works fully offline with no backend.

type MediaParams = { category?: string; title?: string; mediaId?: string[] };
type QueryOptions = { query?: { enabled?: boolean } };

export function useGetMedia(params: MediaParams = {}, options: QueryOptions = {}) {
	return useQuery({
		queryKey: ["media", params],
		queryFn: () => listMedia(params),
		enabled: options.query?.enabled,
	});
}

export function useGetUsersStats(params: { categories?: string[] } = {}, options: QueryOptions = {}) {
	return useQuery({
		queryKey: ["stats", params],
		queryFn: () => getStatistics(params.categories),
		enabled: options.query?.enabled,
	});
}

export function usePostMedia() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: ({ data }: { data: Record<string, unknown> }) => createMedia(data),
		onSuccess: () => client.invalidateQueries({ queryKey: ["media"] }),
	});
}

export function usePostMediaTrack() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: ({ data }: { data: Record<string, unknown> }) => trackMedia(data),
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ["stats"] });
			client.invalidateQueries({ queryKey: ["media"] });
		},
	});
}

export function useGetVideoGamePlaythroughs(videoGameId: string, options: QueryOptions = {}) {
	return useQuery({
		queryKey: ["video-game-playthroughs", videoGameId],
		queryFn: () => repoFindPlaythroughs(videoGameId),
		enabled: options.query?.enabled,
	});
}

export function useCreateVideoGamePlaythrough() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: ({ videoGameId, name }: { videoGameId: string; name?: string }) =>
			repoCreatePlaythrough(videoGameId, name),
		onSuccess: (_id, { videoGameId }) =>
			client.invalidateQueries({ queryKey: ["video-game-playthroughs", videoGameId] }),
	});
}

export function useTrackVideoGamePlaythrough() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: ({ playthroughId, timeSpent }: { playthroughId: string; timeSpent: string | null }) =>
			repoTrackPlaythrough(playthroughId, timeSpent),
		onSuccess: () => client.invalidateQueries({ queryKey: ["stats"] }),
	});
}
