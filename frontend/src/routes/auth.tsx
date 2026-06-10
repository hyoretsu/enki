import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function AuthPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		const form = new FormData(event.currentTarget);
		const email = String(form.get("email"));
		const password = String(form.get("password"));

		const { error } =
			mode === "signUp"
				? await signUp.email({ email, name: String(form.get("name") || email.split("@")[0]), password })
				: await signIn.email({ email, password });

		setLoading(false);

		if (error) {
			toast.error(error.message || t("auth.error"));
			return;
		}

		navigate({ to: "/" });
	};

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<h1 className="text-center font-bold text-2xl text-primary">{t("app.name")}</h1>
					<p className="text-center text-muted-foreground text-sm">{t("app.tagline")}</p>
				</CardHeader>
				<CardContent>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						{mode === "signUp" && (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="name">{t("auth.name")}</Label>
								<Input id="name" name="name" autoComplete="name" />
							</div>
						)}
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="email">{t("auth.email")}</Label>
							<Input id="email" name="email" type="email" autoComplete="email" required />
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="password">{t("auth.password")}</Label>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete={mode === "signUp" ? "new-password" : "current-password"}
								required
							/>
						</div>
						<Button type="submit" disabled={loading}>
							{mode === "signUp"
								? t(loading ? "auth.signingUp" : "auth.signUp")
								: t(loading ? "auth.signingIn" : "auth.signIn")}
						</Button>
					</form>
					<Button
						variant="ghost"
						className="mt-2 w-full text-muted-foreground text-xs"
						onClick={() => setMode(mode === "signUp" ? "signIn" : "signUp")}
					>
						{mode === "signUp" ? t("auth.switchToSignIn") : t("auth.switchToSignUp")}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/auth")({
	component: AuthPage,
});
