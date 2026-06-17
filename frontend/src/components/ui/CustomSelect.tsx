import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuChevronDown } from "react-icons/lu";

export interface SelectOption {
	label: string;
	value: string;
}

export interface SelectGroup {
	label: string;
	options: SelectOption[];
}

interface CustomSelectProps {
	className?: string;
	groups?: SelectGroup[];
	onChange: (value: string) => void;
	options?: SelectOption[];
	value: string;
}

interface DropdownPos {
	left: number;
	top: number;
	width: number;
}

export function CustomSelect({ className, groups, onChange, options, value }: CustomSelectProps) {
	const [open, setOpen] = useState(false);
	const [pos, setPos] = useState<DropdownPos>({ left: 0, top: 0, width: 0 });
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const allOptions: SelectOption[] = groups ? groups.flatMap(g => g.options) : (options ?? []);
	const selected = allOptions.find(o => o.value === value);

	function openDropdown() {
		if (!triggerRef.current) return;
		const rect = triggerRef.current.getBoundingClientRect();
		setPos({ left: rect.left, top: rect.bottom + 4, width: rect.width });
		setOpen(true);
	}

	function select(v: string) {
		onChange(v);
		setOpen(false);
	}

	useEffect(() => {
		if (!open) return;

		function handleClick(e: MouseEvent) {
			if (
				!triggerRef.current?.contains(e.target as Node) &&
				!dropdownRef.current?.contains(e.target as Node)
			) {
				setOpen(false);
			}
		}

		function handleKey(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}

		document.addEventListener("mousedown", handleClick);
		document.addEventListener("keydown", handleKey);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keydown", handleKey);
		};
	}, [open]);

	return (
		<>
			<button
				aria-expanded={open}
				aria-haspopup="listbox"
				className={cn(
					"flex h-11 w-full items-center justify-between rounded-md border border-border bg-background px-3 text-start text-foreground text-sm transition-colors",
					"hover:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
					className,
				)}
				onClick={openDropdown}
				ref={triggerRef}
				type="button"
			>
				<span className={cn(!selected && "text-muted-foreground")}>{selected?.label ?? "—"}</span>
				<LuChevronDown
					className={cn(
						"ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
						open && "rotate-180",
					)}
				/>
			</button>

			{open &&
				createPortal(
					<div
						className="overflow-hidden rounded-md border border-border bg-popover shadow-md"
						onMouseDown={e => e.preventDefault()}
						ref={dropdownRef}
						role="listbox"
						style={{
							left: pos.left,
							maxHeight: 260,
							overflowY: "auto",
							position: "fixed",
							top: pos.top,
							width: pos.width,
							zIndex: 9999,
						}}
					>
						{groups
							? groups.map(group => (
									<div key={group.label}>
										<p className="px-3 py-1.5 font-semibold text-muted-foreground text-xs">{group.label}</p>
										{group.options.map(opt => (
											<button
												className={cn(
													"w-full px-3 py-2 text-left text-sm hover:bg-accent",
													opt.value === value && "bg-accent/60 font-medium",
												)}
												key={opt.value}
												onClick={() => select(opt.value)}
												role="option"
												type="button"
											>
												{opt.label}
											</button>
										))}
									</div>
								))
							: options?.map(opt => (
									<button
										className={cn(
											"w-full px-3 py-2 text-left text-sm hover:bg-accent",
											opt.value === value && "bg-accent/60 font-medium",
										)}
										key={opt.value}
										onClick={() => select(opt.value)}
										role="option"
										type="button"
									>
										{opt.label}
									</button>
								))}
					</div>,
					document.body,
				)}
		</>
	);
}
