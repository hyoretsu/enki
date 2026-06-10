import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
	children: ReactNode;
}

export function Badge({ children, className, ...props }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex w-fit items-center rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 font-medium text-primary text-xs",
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}
