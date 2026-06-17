import {
	createMedia,
	getStatistics,
	listMedia,
	trackMedia,
	createVideoGameRun as repoCreateRun,
	findVideoGameRuns as repoFindRuns,
	trackRun as repoTrackRun,
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

export function useGetVideoGameRuns(videoGameId: string, options: QueryOptions = {}) {
	return useQuery({
		queryKey: ["video-game-runs", videoGameId],
		queryFn: () => repoFindRuns(videoGameId),
		enabled: options.query?.enabled,
	});
}

export function useCreateVideoGameRun() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: ({ videoGameId, name }: { videoGameId: string; name?: string }) =>
			repoCreateRun(videoGameId, name),
		onSuccess: (_id, { videoGameId }) =>
			client.invalidateQueries({ queryKey: ["video-game-runs", videoGameId] }),
	});
}

export function useTrackVideoGameRun() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: ({ runId, timeSpent }: { runId: string; timeSpent: string | null }) =>
			repoTrackRun(runId, timeSpent),
		onSuccess: () => client.invalidateQueries({ queryKey: ["stats"] }),
	});
}
