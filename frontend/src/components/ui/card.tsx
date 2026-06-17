import { useStyletron } from "baseui";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
	children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
	const [css, theme] = useStyletron();

	const surface = css({
		backgroundColor: theme.colors.backgroundSecondary,
		border: `1px solid ${theme.colors.borderOpaque}`,
		borderRadius: theme.borders.radius400,
		boxShadow: theme.lighting.shadow400,
		color: theme.colors.contentPrimary,
	});

	return (
		<div className={`${surface} ${className ?? ""}`} {...props}>
			{children}
		</div>
	);
}

export function CardHeader({ children, className, ...props }: CardProps) {
	const [css] = useStyletron();
	const base = css({ display: "flex", flexDirection: "column", gap: "6px", padding: "24px" });

	return (
		<div className={`${base} ${className ?? ""}`} {...props}>
			{children}
		</div>
	);
}

export function CardTitle({ children, className, ...props }: CardProps) {
	const [css] = useStyletron();
	const base = css({ fontSize: "1.25rem", fontWeight: 600, lineHeight: 1 });

	return (
		<div className={`${base} ${className ?? ""}`} {...props}>
			{children}
		</div>
	);
}

export function CardDescription({ children, className, ...props }: CardProps) {
	const [css, theme] = useStyletron();
	const base = css({ color: theme.colors.contentSecondary, fontSize: "0.875rem" });

	return (
		<div className={`${base} ${className ?? ""}`} {...props}>
			{children}
		</div>
	);
}

export function CardContent({ children, className, ...props }: CardProps) {
	// Padding is supplied by callers via className (p-4/p-5/...), so none is set here.
	return (
		<div className={className} {...props}>
			{children}
		</div>
	);
}
