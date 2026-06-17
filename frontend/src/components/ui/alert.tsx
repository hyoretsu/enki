import { useStyletron } from "baseui";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface AlertProps extends ComponentPropsWithoutRef<"div"> {
	children: ReactNode;
}

export function Alert({ children, className, ...props }: AlertProps) {
	const [css, theme] = useStyletron();

	const base = css({
		backgroundColor: theme.colors.negative50 ?? "rgba(248,113,113,0.12)",
		border: `1px solid ${theme.colors.negative}`,
		borderRadius: theme.borders.radius300,
		color: theme.colors.contentPrimary,
		fontSize: "0.875rem",
		paddingBlock: "8px",
		paddingInline: "12px",
	});

	return (
		<div className={`${base} ${className ?? ""}`} {...props}>
			{children}
		</div>
	);
}
