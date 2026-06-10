import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {}

export function Checkbox({ className, ...props }: CheckboxProps) {
	return (
		<input
			type="checkbox"
			className={cn("size-4 cursor-pointer rounded border-input bg-background accent-primary", className)}
			{...props}
		/>
	);
}
