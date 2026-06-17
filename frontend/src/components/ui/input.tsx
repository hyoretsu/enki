import { Input as BaseInput, SIZE } from "baseui/input";
import type { ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

// baseui only forwards a known prop set to the real <input>; native attributes
// (name, min, max, step, required, pattern, inputMode, …) are passed through the
// `Input` override slot so form behaviour and validation are preserved.
export function Input({ className, type, value, onChange, placeholder, disabled, ...native }: InputProps) {
	return (
		<BaseInput
			size={SIZE.compact}
			type={type}
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
