import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { supportedLngs } from "@/i18n/config";
import { signOut, useSession } from "@/lib/auth-client";
import { type Theme, useSettingsStore } from "@/stores";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function ProfilePage() {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const { data: session } = useSession();
	const { setTheme, theme } = useSettingsStore();

	const handleSignOut = async () => {
		await signOut();
		navigate({ to: "/auth" });
	};

	return (
		<div className="mx-auto flex w-full max-w-xl flex-col gap-4">
			<h1 className="font-bold text-2xl">{t("profile.title")}</h1>

			<Card>
				<CardContent className="flex items-center gap-4 p-4">
					<div className="flex size-12 items-center justify-center rounded-full bg-primary font-bold text-lg text-primary-foreground">
						{session?.user.name?.[0]?.toUpperCase() ?? "?"}
					</div>
					<div className="min-w-0">
						<p className="truncate font-medium">{session?.user.name}</p>
						<p className="truncate text-muted-foreground text-sm">{session?.user.email}</p>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="flex flex-col gap-4 p-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="language">{t("profile.language")}</Label>
						<Select
							id="language"
							value={i18n.language}
							onChange={event => i18n.changeLanguage(event.target.value)}
						>
							{supportedLngs.map(lng => (
								<option key={lng} value={lng}>
									{lng}
								</option>
							))}
						</Select>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="theme">{t("profile.theme")}</Label>
						<Select id="theme" value={theme} onChange={event => setTheme(event.target.value as Theme)}>
							<option value="dark">{t("profile.themeDark")}</option>
							<option value="light">{t("profile.themeLight")}</option>
						</Select>
					</div>
				</CardContent>
			</Card>

			<Button variant="outline" className="text-destructive" onClick={handleSignOut}>
				{t("profile.signOut")}
			</Button>
		</div>
	);
}

export const Route = createFileRoute("/profile")({
	component: ProfilePage,
});
