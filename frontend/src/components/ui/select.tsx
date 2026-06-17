import { Children, type ReactNode, isValidElement } from "react";
import { CustomSelect, type SelectOption } from "./CustomSelect";

// Drop-in replacement for the old native <select>: keeps the `<option>`-children API the
// call sites use, but renders the portal-based CustomSelect (no native <select>, per the
// design-system rule). `onChange` still receives an event-like `{ target: { value } }`.
interface SelectProps {
	children?: ReactNode;
	className?: string;
	defaultValue?: string;
	disabled?: boolean;
	id?: string;
	name?: string;
	onChange?: (event: { target: { value: string } }) => void;
	required?: boolean;
	value?: string;
}

function extractOptions(children: ReactNode): SelectOption[] {
	const options: SelectOption[] = [];

	Children.forEach(children, child => {
		if (!isValidElement(child)) return;

		const props = child.props as { children?: ReactNode; value?: string | number };
		if (props.value === undefined) return;

		options.push({ label: String(props.children ?? props.value), value: String(props.value) });
	});

	return options;
}

export function Select({ children, className, defaultValue, onChange, value }: SelectProps) {
	return (
		<CustomSelect
			className={className}
			onChange={next => onChange?.({ target: { value: next } })}
			options={extractOptions(children)}
			value={value ?? defaultValue ?? ""}
		/>
	);
}
