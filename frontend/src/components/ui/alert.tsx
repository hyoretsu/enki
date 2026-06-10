import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface AlertProps extends ComponentPropsWithoutRef<"div"> {
	children: ReactNode;
}

export function Alert({ children, className, ...props }: AlertProps) {
	return (
		<div
			className={cn("rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm", className)}
			{...props}
		>
			{children}
		</div>
	);
}
