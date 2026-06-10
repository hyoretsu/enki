import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "default" | "outline" | "ghost";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
	children: ReactNode;
	variant?: ButtonVariant;
}

const variantClassName: Record<ButtonVariant, string> = {
	default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
	ghost: "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
	outline: "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
};

export function Button({ children, className, variant = "default", ...props }: ButtonProps) {
	return (
		<button
			className={cn(
				"inline-flex h-11 items-center justify-center gap-2 rounded-md border px-4 font-medium text-sm transition-colors",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				"disabled:pointer-events-none disabled:opacity-50",
				variantClassName[variant],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
