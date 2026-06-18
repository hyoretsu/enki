import { Textarea as BaseTextarea, SIZE } from "baseui/textarea";
import type { ComponentPropsWithoutRef } from "react";

interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {}

export function Textarea({ className, value, onChange, placeholder, disabled, ...native }: TextareaProps) {
	return (
		<BaseTextarea
			size={SIZE.compact}
			value={value as never}
			onChange={onChange as never}
			placeholder={placeholder}
			disabled={disabled}
			overrides={{
				Root: { props: { className } },
				Input: { props: native },
			}}
		/>
	);
}
