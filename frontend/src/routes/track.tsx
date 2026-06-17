import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useGetMedia, usePostMediaTrack } from "@/lib/data";
import { pickTitle } from "@/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
	CategorySelect,
	DurationInput,
	type DurationValue,
	FormField,
	emptyDuration,
	toIsoDuration,
} from "./components/fields";

const categories = ["chapter", "movie", "video", "video_game"] as const;

const mediaCategoryFor: Record<string, string> = {
	chapter: "literary_work",
	movie: "movie",
	video_game: "video_game",
};

function TrackMediaPage() {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const searchParams = Route.useSearch();

	const [category, setCategory] = useState<string>(
		searchParams.category === "literary_work" ? "chapter" : (searchParams.category ?? "chapter"),
	);
	const [mediaId, setMediaId] = useState<string>(searchParams.mediaId ?? "");
	const [timeSpent, setTimeSpent] = useState<DurationValue>(emptyDuration);
	const [offset, setOffset] = useState<DurationValue>(emptyDuration);
	const [bookmarked, setBookmarked] = useState(false);

	const listedCategory = mediaCategoryFor[category];
	const { data: mediaOptions } = useGetMedia(
		{ category: listedCategory },
		{ query: { enabled: !!listedCategory } },
	);

	const { isPending, mutateAsync: postMediaTrack } = usePostMediaTrack();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const field = (name: string) => {
			const value = form.get(name);
			return value === null || value === "" ? undefined : String(value);
		};

		const when = field("when") ? new Date(String(field("when"))).toISOString() : undefined;

		let data: Record<string, any>;
		switch (category) {
			case "chapter":
				data = {
					bookmarked,
					category,
					mediaId,
					number: Number(field("number")),
					pages: field("pages") ? Number(field("pages")) : undefined,
					timeSpent: toIsoDuration(timeSpent) ?? "PT0S",
					when,
				};
				break;
			case "movie":
				data = {
					bookmarked,
					category,
					mediaId,
					rating: field("rating") ? Number(field("rating")) : undefined,
					when,
				};
				break;
			case "video":
				data = {
					bookmarked,
					category,
					link: field("link"),
					timeSpent: toIsoDuration(timeSpent),
					when,
				};
				break;
			default:
				data = {
					bookmarked,
					category,
					mediaId,
					offset: toIsoDuration(offset),
					score: field("score") ? Number(field("score")) : undefined,
					timeSpent: toIsoDuration(timeSpent),
				};
		}

		try {
			await postMediaTrack({ data: data as any });

			toast.success(t("track.success"));
			navigate({ to: "/stats" });
		} catch (error: any) {
			toast.error(String((await error?.response?.text?.()) || error?.message || error));
		}
	};

	return (
		<div className="mx-auto flex w-full max-w-xl flex-col gap-4">
			<h1 className="font-bold text-2xl">{t("track.title")}</h1>

			<Card>
				<CardContent className="p-4">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<CategorySelect
							categories={categories}
							value={category}
							onChange={value => {
								setCategory(value);
								setMediaId("");
							}}
						/>

						{listedCategory && (
							<FormField label={t("track.media")} htmlFor="mediaId">
								<Select
									id="mediaId"
									value={mediaId}
									onChange={event => setMediaId(event.target.value)}
									required
								>
									<option value="" disabled>
										{t("track.selectMedia")}
									</option>
									{(mediaOptions ?? []).map((each: Record<string, any>) => (
										<option key={each.id} value={each.id}>
											{pickTitle(each.title, i18n.language)}
										</option>
									))}
								</Select>
							</FormField>
						)}

						{category === "chapter" && (
							<div className="grid grid-cols-2 gap-4">
								<FormField label={t("track.chapterNumber")} htmlFor="number">
									<Input id="number" name="number" type="number" step="0.1" min={0} required />
								</FormField>
								<FormField label={t("track.pages")} htmlFor="pages">
									<Input id="pages" name="pages" type="number" min={0} />
								</FormField>
							</div>
						)}

						{category === "video" && (
							<FormField label={t("track.link")} htmlFor="link">
								<Input
									id="link"
									name="link"
									type="url"
									placeholder="https://www.youtube.com/watch?v=..."
									required
								/>
							</FormField>
						)}

						{category === "movie" && (
							<FormField label={t("track.rating")} htmlFor="rating">
								<Input id="rating" name="rating" type="number" step="0.1" min={0} max={10} />
							</FormField>
						)}

						{category === "video_game" && (
							<>
								<FormField label={t("track.score")} htmlFor="score">
									<Input id="score" name="score" type="number" step="0.1" min={0} max={10} />
								</FormField>
								<DurationInput label={t("track.offset")} value={offset} onChange={setOffset} />
							</>
						)}

						{category !== "movie" && (
							<DurationInput label={t("track.timeSpent")} value={timeSpent} onChange={setTimeSpent} />
						)}

						{category !== "video_game" && (
							<FormField label={t("track.when")} htmlFor="when">
								<Input id="when" name="when" type="datetime-local" />
							</FormField>
						)}

						<label className="flex items-center gap-2 text-sm" htmlFor="bookmarked">
							<Checkbox
								id="bookmarked"
								checked={bookmarked}
								onChange={event => setBookmarked(event.target.checked)}
							/>
							{t("track.bookmarked")}
						</label>

						<Button type="submit" disabled={isPending}>
							{t(isPending ? "track.submitting" : "track.submit")}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/track")({
	component: TrackMediaPage,
	validateSearch: (search: Record<string, unknown>): { category?: string; mediaId?: string } => ({
		category: search.category ? String(search.category) : undefined,
		mediaId: search.mediaId ? String(search.mediaId) : undefined,
	}),
});
