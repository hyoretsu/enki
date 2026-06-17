import { useStyletron } from "baseui";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
	children: ReactNode;
}

export function Badge({ children, className, ...props }: BadgeProps) {
	const [css, theme] = useStyletron();

	const base = css({
		alignItems: "center",
		backgroundColor: theme.colors.backgroundTertiary,
		border: `1px solid ${theme.colors.borderOpaque}`,
		borderRadius: theme.borders.radius200,
		color: theme.colors.contentPrimary,
		display: "inline-flex",
		fontSize: "0.75rem",
		fontWeight: 500,
		paddingBlock: "4px",
		paddingInline: "10px",
		width: "fit-content",
	});

	return (
		<span className={`${base} ${className ?? ""}`} {...props}>
			{children}
		</span>
	);
}
