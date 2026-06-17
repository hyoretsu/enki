import { useEffect, useRef, useState } from "react";

export function useDebouncedInput(externalValue: string, onChange: (value: string) => void, delay = 300) {
	const [local, setLocal] = useState(externalValue);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const lastSent = useRef(externalValue);

	useEffect(() => {
		if (externalValue !== lastSent.current) {
			setLocal(externalValue);
			lastSent.current = externalValue;
		}
	}, [externalValue]);

	function handleChange(next: string) {
		setLocal(next);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			lastSent.current = next;
			onChange(next);
		}, delay);
	}

	function flush() {
		clearTimeout(timer.current);
		lastSent.current = local;
		onChange(local);
	}

	return [local, handleChange, flush] as const;
}
