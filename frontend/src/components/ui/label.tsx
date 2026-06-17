import { useStyletron } from "baseui";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface LabelProps extends ComponentPropsWithoutRef<"label"> {
	children: ReactNode;
}

export function Label({ children, className, ...props }: LabelProps) {
	const [css] = useStyletron();
	const base = css({ display: "grid", fontSize: "0.875rem", fontWeight: 500, gap: "8px", lineHeight: 1 });

	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: Callers provide the paired control as children or through htmlFor.
		<label className={`${base} ${className ?? ""}`} {...props}>
			{children}
		</label>
	);
}
