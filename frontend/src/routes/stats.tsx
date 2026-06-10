import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetUsersStats } from "@/lib/api";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const categories = ["literary_work", "movie", "video", "video_game"] as const;
const units = ["days", "hours", "minutes", "seconds"] as const;

function StatsPage() {
	const { t } = useTranslation();
	const [selected, setSelected] = useState<string[]>([]);

	const { data: stats, isLoading } = useGetUsersStats(selected.length ? { categories: selected } : {});

	const toggle = (category: string) => {
		setSelected(current =>
			current.includes(category) ? current.filter(each => each !== category) : [...current, category],
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-2xl">{t("stats.title")}</h1>

			<fieldset className="flex flex-col gap-2">
				<legend className="mb-2 text-muted-foreground text-sm">{t("stats.categories")}</legend>
				<div className="flex flex-wrap gap-x-5 gap-y-2">
					{categories.map(each => (
						<label key={each} htmlFor={each} className="flex items-center gap-2 text-sm">
							<Checkbox id={each} checked={selected.includes(each)} onChange={() => toggle(each)} />
							{t(`category.${each}`)}
						</label>
					))}
				</div>
			</fieldset>

			<h2 className="mt-2 text-muted-foreground text-sm uppercase tracking-wide">{t("stats.totalTime")}</h2>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{units.map((unit, index) => (
					<Card key={unit}>
						<CardContent className="flex flex-col items-center gap-1 p-5">
							<span className={cn("font-bold text-3xl", isLoading && "text-muted-foreground")}>
								{isLoading ? "…" : (stats?.totalTime[index] ?? 0)}
							</span>
							<span className="text-muted-foreground text-xs uppercase tracking-wide">
								{t(`stats.${unit}`)}
							</span>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

export const Route = createFileRoute("/stats")({
	component: StatsPage,
});
