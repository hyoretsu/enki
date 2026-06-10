import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMedia } from "@/lib/api";
import { formatSeconds, pickTitle } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
	if (value == null || value === "") {
		return null;
	}

	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-muted-foreground text-xs uppercase tracking-wide">{label}</span>
			<span className="text-sm">{value}</span>
		</div>
	);
}

function MediaDetailPage() {
	const { i18n, t } = useTranslation();
	const { mediaId } = Route.useParams();
	const { category } = Route.useSearch();

	const { data, isLoading } = useGetMedia({ category, mediaId: [mediaId] });

	const media = data?.[0] as Record<string, any> | undefined;

	if (isLoading) {
		return <p className="py-10 text-center text-muted-foreground">...</p>;
	}

	if (!media) {
		return <p className="py-10 text-center text-muted-foreground">{t("detail.notFound")}</p>;
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex flex-col gap-2">
					<h1 className="font-bold text-2xl">{pickTitle(media.title, i18n.language)}</h1>
					<div className="flex flex-wrap items-center gap-2">
						<Badge>{t(`category.${category}` as any)}</Badge>
						{category === "literary_work" && media.ongoing != null && (
							<Badge className="bg-secondary text-secondary-foreground">
								{media.ongoing ? t("detail.ongoing") : t("detail.finished")}
							</Badge>
						)}
					</div>
				</div>
				<Link to="/track" search={{ category, mediaId }}>
					<Button>{t("detail.trackThis")}</Button>
				</Link>
			</div>

			<Card>
				<CardContent className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
					<Field label={t("detail.type")} value={media.type && t(`add.workType.${media.type}` as any)} />
					<Field label={t("detail.duration")} value={media.duration && formatSeconds(media.duration)} />
					<Field
						label={t("detail.releaseDate")}
						value={media.releaseDate && new Date(media.releaseDate).toLocaleDateString(i18n.language)}
					/>
					<Field label={t("detail.channel")} value={media.channelId} />
					{media.link && (
						<div className="flex flex-col gap-0.5">
							<span className="text-muted-foreground text-xs uppercase tracking-wide">
								{t("detail.link")}
							</span>
							<a
								href={media.link}
								target="_blank"
								rel="noreferrer"
								className="truncate text-primary text-sm underline"
							>
								{media.link}
							</a>
						</div>
					)}
				</CardContent>
			</Card>

			{media.synopsis && (
				<Card>
					<CardHeader>
						<CardTitle>{t("detail.synopsis")}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">{pickTitle(media.synopsis, i18n.language)}</p>
					</CardContent>
				</Card>
			)}

			{!!media.tags?.length && (
				<div className="flex flex-wrap gap-2">
					{media.tags.map((tag: string) => (
						<Badge key={tag} className="bg-secondary text-secondary-foreground">
							{tag}
						</Badge>
					))}
				</div>
			)}

			{!!media.chapters?.length && (
				<Card>
					<CardHeader>
						<CardTitle>
							{t("detail.chapters")} ({media.chapters.filter(Boolean).length})
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col divide-y divide-border">
						{media.chapters
							.filter(Boolean)
							.sort((a: Record<string, any>, b: Record<string, any>) => a.number - b.number)
							.map((chapter: Record<string, any>) => (
								<div key={chapter.id} className="flex items-center justify-between py-2 text-sm">
									<span>
										#{chapter.number}
										{chapter.title ? ` — ${pickTitle(chapter.title, i18n.language)}` : ""}
									</span>
									<span className="text-muted-foreground text-xs">
										{chapter.pages ? `${chapter.pages} ${t("detail.pages").toLowerCase()}` : ""}
									</span>
								</div>
							))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}

export const Route = createFileRoute("/media/$mediaId")({
	component: MediaDetailPage,
	validateSearch: (search: Record<string, unknown>): { category: string } => ({
		category: String(search.category ?? "movie"),
	}),
});
