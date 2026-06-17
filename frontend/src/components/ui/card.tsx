import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
	children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
	return (
		<div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props}>
			{children}
		</div>
	);
}

export function CardHeader({ children, className, ...props }: CardProps) {
	return (
		<div className={cn("flex flex-col gap-1.5 p-6", className)} {...props}>
			{children}
		</div>
	);
}

export function CardTitle({ children, className, ...props }: CardProps) {
	return (
		<div className={cn("font-semibold text-xl leading-none", className)} {...props}>
			{children}
		</div>
	);
}

export function CardDescription({ children, className, ...props }: CardProps) {
	return (
		<div className={cn("text-muted-foreground text-sm", className)} {...props}>
			{children}
		</div>
	);
}

export function CardContent({ children, className, ...props }: CardProps) {
	return (
		<div className={cn("p-6 pt-0", className)} {...props}>
			{children}
		</div>
	);
}
