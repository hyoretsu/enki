import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useGetMedia, usePostMedia } from "@/lib/api";
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
	type IntlText,
	IntlTextInput,
	emptyDuration,
	toIntlField,
	toIsoDuration,
} from "./components/fields";

const categories = ["literary_work", "chapter", "movie", "video", "video_game"] as const;

const literaryWorkTypes = [
	"article",
	"biography",
	"comics",
	"diary",
	"epic",
	"essay",
	"flash_fiction",
	"graphic_novel",
	"journal",
	"light_novel",
	"manga",
	"manhua",
	"manhwa",
	"memoir",
	"novel",
	"novelette",
	"novella",
	"poetry",
	"script",
	"short_story",
	"web_novel",
	"webtoon",
] as const;

function AddMediaPage() {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();

	const [category, setCategory] = useState<string>("literary_work");
	const [title, setTitle] = useState<IntlText>({ lang: "en", text: "" });
	const [synopsis, setSynopsis] = useState<IntlText>({ lang: "en", text: "" });
	const [duration, setDuration] = useState<DurationValue>(emptyDuration);
	const [ongoing, setOngoing] = useState(true);

	const { data: works } = useGetMedia(
		{ category: "literary_work" },
		{ query: { enabled: category === "chapter" } },
	);

	const { isPending, mutateAsync: postMedia } = usePostMedia();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const field = (name: string) => {
			const value = form.get(name);
			return value === null || value === "" ? undefined : String(value);
		};

		let data: Record<string, any>;
		switch (category) {
			case "chapter":
				data = {
					category,
					number: Number(field("number")),
					pages: field("pages") ? Number(field("pages")) : undefined,
					releaseDate: field("releaseDate"),
					sourceId: field("sourceId"),
					title: toIntlField(title),
				};
				break;
			case "literary_work":
				data = {
					category,
					currentChapters: field("currentChapters") ? Number(field("currentChapters")) : undefined,
					ongoing,
					synopsis: toIntlField(synopsis),
					tags: field("tags")
						?.split(",")
						.map(tag => tag.trim())
						.filter(Boolean),
					title: toIntlField(title),
					type: field("type"),
				};
				break;
			case "movie":
				data = {
					category,
					duration: toIsoDuration(duration),
					releaseDate: field("releaseDate"),
					title: toIntlField(title),
				};
				break;
			case "video":
				data = { category, link: field("link") };
				break;
			default:
				data = { category, title: toIntlField(title) };
		}

		try {
			const id = await postMedia({ data: data as any });

			toast.success(t("add.success"));

			if (category !== "chapter" && category !== "video") {
				navigate({ to: "/media/$mediaId", params: { mediaId: id }, search: { category } });
			}
		} catch (error: any) {
			toast.error(String((await error?.response?.text?.()) || error?.message || error));
		}
	};

	return (
		<div className="mx-auto flex w-full max-w-xl flex-col gap-4">
			<h1 className="font-bold text-2xl">{t("add.title")}</h1>

			<Card>
				<CardContent className="p-4">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<CategorySelect categories={categories} value={category} onChange={setCategory} />

						{category !== "video" && (
							<IntlTextInput
								label={t("add.titleField")}
								required={category !== "chapter"}
								value={title}
								onChange={setTitle}
							/>
						)}

						{category === "chapter" && (
							<>
								<FormField label={t("add.sourceWork")} htmlFor="sourceId">
									<Select id="sourceId" name="sourceId" required>
										{(works ?? []).map((work: Record<string, any>) => (
											<option key={work.id} value={work.id}>
												{pickTitle(work.title, i18n.language)}
											</option>
										))}
									</Select>
								</FormField>
								<div className="grid grid-cols-2 gap-4">
									<FormField label={t("add.chapterNumber")} htmlFor="number">
										<Input id="number" name="number" type="number" step="0.1" min={0} required />
									</FormField>
									<FormField label={t("add.pages")} htmlFor="pages">
										<Input id="pages" name="pages" type="number" min={0} />
									</FormField>
								</div>
								<FormField label={t("add.releaseDate")} htmlFor="releaseDate">
									<Input id="releaseDate" name="releaseDate" type="date" />
								</FormField>
							</>
						)}

						{category === "literary_work" && (
							<>
								<FormField label={t("add.type")} htmlFor="type">
									<Select id="type" name="type" defaultValue="novel" required>
										{literaryWorkTypes.map(each => (
											<option key={each} value={each}>
												{t(`add.workType.${each}`)}
											</option>
										))}
									</Select>
								</FormField>
								<IntlTextInput label={t("add.synopsis")} value={synopsis} onChange={setSynopsis} />
								<FormField label={t("add.tags")} htmlFor="tags">
									<Input id="tags" name="tags" placeholder="action, fantasy" />
								</FormField>
								<div className="grid grid-cols-2 items-end gap-4">
									<FormField label={t("add.currentChapters")} htmlFor="currentChapters">
										<Input id="currentChapters" name="currentChapters" type="number" min={0} />
									</FormField>
									<label className="flex h-11 items-center gap-2 text-sm" htmlFor="ongoing">
										<Checkbox
											id="ongoing"
											checked={ongoing}
											onChange={event => setOngoing(event.target.checked)}
										/>
										{t("add.ongoing")}
									</label>
								</div>
								<p className="-mt-3 text-muted-foreground text-xs">{t("add.currentChaptersHint")}</p>
							</>
						)}

						{category === "movie" && (
							<>
								<DurationInput label={t("add.duration")} value={duration} onChange={setDuration} />
								<FormField label={t("add.releaseDate")} htmlFor="releaseDate">
									<Input id="releaseDate" name="releaseDate" type="date" />
								</FormField>
							</>
						)}

						{category === "video" && (
							<FormField label={t("add.link")} htmlFor="link">
								<Input
									id="link"
									name="link"
									type="url"
									placeholder="https://www.youtube.com/watch?v=..."
									required
								/>
							</FormField>
						)}

						<Button type="submit" disabled={isPending}>
							{t(isPending ? "add.submitting" : "add.submit")}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/add")({
	component: AddMediaPage,
});
