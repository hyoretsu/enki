import { Button as BaseButton, KIND, SIZE } from "baseui/button";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "default" | "outline" | "ghost";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
	children: ReactNode;
	variant?: ButtonVariant;
}

const variantKind: Record<ButtonVariant, (typeof KIND)[keyof typeof KIND]> = {
	default: KIND.primary,
	ghost: KIND.tertiary,
	outline: KIND.secondary,
};

export function Button({ children, className, variant = "default", type, ...props }: ButtonProps) {
	return (
		<BaseButton
			kind={variantKind[variant]}
			size={SIZE.compact}
			// baseui defaults the DOM button to type="button" and ignores a top-level `type`,
			// so it is forwarded through the BaseButton slot to keep form submission working.
			overrides={{ BaseButton: { props: { className, type: type ?? "button" } } }}
			{...(props as Record<string, unknown>)}
		>
			{children}
		</BaseButton>
	);
}
