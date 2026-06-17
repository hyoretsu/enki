import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetMedia } from "@/lib/data";
import { cn, pickTitle } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";

const categories = ["literary_work", "movie", "video", "video_game"] as const;

function LibraryPage() {
	const { i18n, t } = useTranslation();
	const [category, setCategory] = useQueryState("category");
	const [search, setSearch] = useQueryState("title", { defaultValue: "" });

	const { data: media, isLoading } = useGetMedia({
		...(category ? { category } : {}),
		...(search ? { title: search } : {}),
	});

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-2xl">{t("library.title")}</h1>

			<div className="relative">
				<FiSearch className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
				<Input
					className="pl-9"
					placeholder={t("library.search")}
					value={search}
					onChange={event => setSearch(event.target.value || null)}
				/>
			</div>

			<div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
				<CategoryTab active={!category} label={t("library.all")} onClick={() => setCategory(null)} />
				{categories.map(each => (
					<CategoryTab
						key={each}
						active={category === each}
						label={t(`category.${each}`)}
						onClick={() => setCategory(each)}
					/>
				))}
			</div>

			{isLoading ? (
				<p className="py-10 text-center text-muted-foreground">...</p>
			) : !media?.length ? (
				<p className="py-10 text-center text-muted-foreground">{t("library.empty")}</p>
			) : (
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{media.map((each: Record<string, any>) => (
						<Link
							key={each.id}
							to="/media/$mediaId"
							params={{ mediaId: each.id }}
							search={{ category: each.category }}
						>
							<Card className="h-full transition-colors hover:border-primary/50">
								<CardContent className="flex flex-col gap-2 p-4">
									<span className="line-clamp-2 font-medium">{pickTitle(each.title, i18n.language)}</span>
									<div className="flex items-center gap-2">
										<Badge>{t(`category.${each.category}` as any)}</Badge>
										{each.releaseDate && (
											<span className="text-muted-foreground text-xs">
												{new Date(each.releaseDate).toLocaleDateString(i18n.language)}
											</span>
										)}
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}

function CategoryTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors",
				active
					? "border-transparent bg-primary text-primary-foreground"
					: "border-border bg-transparent text-muted-foreground hover:text-foreground",
			)}
		>
			{label}
		</button>
	);
}

export const Route = createFileRoute("/")({
	component: LibraryPage,
});
