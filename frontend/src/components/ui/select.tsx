import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface SelectProps extends ComponentPropsWithoutRef<"select"> {}

export function Select({ className, children, ...props }: SelectProps) {
	return (
		<select
			className={cn(
				"flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				"disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		>
			{children}
		</select>
	);
}
