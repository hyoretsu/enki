import { Checkbox as BaseCheckbox } from "baseui/checkbox";
import type { ComponentPropsWithoutRef } from "react";

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {}

export function Checkbox({ className, checked, onChange, disabled, ...native }: CheckboxProps) {
	return (
		<BaseCheckbox
			checked={checked}
			onChange={onChange as never}
			disabled={disabled}
			overrides={{
				Root: { props: { className } },
				Input: { props: native },
			}}
		/>
	);
}
