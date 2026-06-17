import appCss from "@/globals.css?url";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import { useSettingsStore } from "@/stores";
import interCss from "@fontsource-variable/inter/index.css?url";
import { HeadContent, Link, Outlet, Scripts, createRootRoute, useLocation } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { FiBarChart2, FiBookOpen, FiCheckSquare, FiPlusCircle, FiUser } from "react-icons/fi";

interface NavEntry {
	icon: IconType;
	label: "library" | "add" | "track" | "stats" | "profile";
	to: string;
}

const navEntries: NavEntry[] = [
	{ icon: FiBookOpen, label: "library", to: "/" },
	{ icon: FiPlusCircle, label: "add", to: "/add" },
	{ icon: FiCheckSquare, label: "track", to: "/track" },
	{ icon: FiBarChart2, label: "stats", to: "/stats" },
	{ icon: FiUser, label: "profile", to: "/profile" },
];

function NavLink({ entry, mobile }: { entry: NavEntry; mobile?: boolean }) {
	const { t } = useTranslation();
	const { pathname } = useLocation();

	const active = entry.to === "/" ? pathname === "/" : pathname.startsWith(entry.to);

	return (
		<Link
			to={entry.to}
			className={cn(
				"flex items-center gap-3 rounded-md transition-colors",
				mobile ? "flex-1 flex-col gap-1 py-2 text-[11px]" : "px-3 py-2 text-sm font-medium",
				active ? "text-primary" : "text-muted-foreground hover:text-foreground",
				!mobile && active && "bg-accent",
			)}
		>
			<entry.icon className={mobile ? "size-5" : "size-4"} />
			<span>{t(`nav.${entry.label}`)}</span>
		</Link>
	);
}

function Shell({ children }: { children: ReactNode }) {
	const { t } = useTranslation();

	return (
		<div className="flex min-h-screen">
			{/* Desktop sidebar */}
			<aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-1 border-border border-r p-4 md:flex">
				<Link to="/" className="mb-6 px-3 font-bold text-primary text-xl">
					{t("app.name")}
				</Link>
				{navEntries.map(entry => (
					<NavLink key={entry.to} entry={entry} />
				))}
			</aside>

			<main className="min-w-0 flex-1 pb-20 md:pb-0">
				<div className="mx-auto w-full max-w-screen-lg px-4 py-6 sm:px-6">{children}</div>
			</main>

			{/* Mobile bottom navigation */}
			<nav
				className="fixed inset-x-0 bottom-0 z-50 flex border-border border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
				aria-label="Main"
			>
				{navEntries.map(entry => (
					<NavLink key={entry.to} entry={entry} mobile />
				))}
			</nav>
		</div>
	);
}

function RootComponent() {
	const { pathname } = useLocation();
	const theme = useSettingsStore(state => state.theme);

	// Auth is optional: the app runs fully on local data. Signing in is only needed to unlock
	// premium features (Google Drive sync), so there is no redirect for anonymous users.
	const isAuthRoute = pathname.startsWith("/auth");

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		document.documentElement.classList.toggle("light", theme === "light");
	}, [theme]);

	return (
		<div className="min-h-screen bg-background text-foreground">
			{isAuthRoute ? (
				<Outlet />
			) : (
				<Shell>
					<Outlet />
				</Shell>
			)}
		</div>
	);
}

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html className="dark" lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Providers>{children}</Providers>
				<Scripts />
			</body>
		</html>
	);
}

export const Route = createRootRoute({
	component: RootComponent,
	head: () => ({
		links: [
			{ href: appCss, rel: "stylesheet" },
			{ href: interCss, rel: "stylesheet" },
		],
		meta: [
			{ charSet: "utf-8" },
			{
				content:
					"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
				name: "viewport",
			},
			{ title: "enki" },
			{ content: "#0b1120", name: "theme-color" },
			{ content: "yes", name: "apple-mobile-web-app-capable" },
			{ content: "black-translucent", name: "apple-mobile-web-app-status-bar-style" },
		],
	}),
	shellComponent: RootDocument,
});
