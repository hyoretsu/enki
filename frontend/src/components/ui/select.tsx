import { Select as BaseSelect, SIZE, type Value } from "baseui/select";
import { Children, type ReactNode, isValidElement } from "react";

interface Option {
	id: string;
	label: string;
}

// Keeps the `<option>`-children API the call sites use, but renders baseui's Select
// (no native <select>, per the design-system rule). `onChange` still receives an
// event-like `{ target: { value } }` so existing controlled handlers keep working.
interface SelectProps {
	children?: ReactNode;
	className?: string;
	clearable?: boolean;
	defaultValue?: string;
	disabled?: boolean;
	id?: string;
	name?: string;
	onChange?: (event: { target: { value: string } }) => void;
	placeholder?: string;
	required?: boolean;
	value?: string;
}

function extractOptions(children: ReactNode): Option[] {
	const options: Option[] = [];

	Children.forEach(children, child => {
		if (!isValidElement(child)) return;

		const props = child.props as { children?: ReactNode; value?: string | number };
		if (props.value === undefined) return;

		options.push({ id: String(props.value), label: String(props.children ?? props.value) });
	});

	return options;
}

export function Select({
	children,
	className,
	clearable = false,
	defaultValue,
	disabled,
	onChange,
	placeholder,
	value,
}: SelectProps) {
	const options = extractOptions(children);
	const current = value ?? defaultValue ?? "";
	const selected: Value = options.filter(option => option.id === current);

	return (
		<BaseSelect
			clearable={clearable}
			disabled={disabled}
			searchable={false}
			size={SIZE.compact}
			options={options}
			placeholder={placeholder ?? ""}
			value={selected}
			onChange={params => onChange?.({ target: { value: String(params.value[0]?.id ?? "") } })}
			overrides={{ Root: { props: { className } } }}
		/>
	);
}
