import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface LabelProps extends ComponentPropsWithoutRef<"label"> {
	children: ReactNode;
}

export function Label({ children, className, ...props }: LabelProps) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: Callers provide the paired control as children or through htmlFor.
		<label className={cn("grid gap-2 font-medium text-sm leading-none", className)} {...props}>
			{children}
		</label>
	);
}
