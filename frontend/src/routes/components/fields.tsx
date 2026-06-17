import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export function FormField({
	children,
	label,
	htmlFor,
}: { children: ReactNode; label: string; htmlFor?: string }) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label htmlFor={htmlFor}>{label}</Label>
			{children}
		</div>
	);
}

export interface IntlText {
	lang: string;
	text: string;
}

/** A title/synopsis input alongside its language code, mapping to enki's `{ [lang]: string[] }` fields. */
export function IntlTextInput({
	label,
	onChange,
	required,
	value,
}: {
	label: string;
	onChange: (value: IntlText) => void;
	required?: boolean;
	value: IntlText;
}) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-1.5">
			<Label>{label}</Label>
			<div className="flex gap-2">
				<Input
					aria-label={t("add.language")}
					className="w-20"
					maxLength={5}
					value={value.lang}
					onChange={event => onChange({ ...value, lang: event.target.value })}
				/>
				<Input
					className="flex-1"
					required={required}
					value={value.text}
					onChange={event => onChange({ ...value, text: event.target.value })}
				/>
			</div>
		</div>
	);
}

export const toIntlField = ({ lang, text }: IntlText): Record<string, string[]> | undefined =>
	text ? { [lang || "en"]: [text] } : undefined;

export interface DurationValue {
	hours: string;
	minutes: string;
	seconds: string;
}

export const emptyDuration: DurationValue = { hours: "", minutes: "", seconds: "" };

export const toIsoDuration = ({ hours, minutes, seconds }: DurationValue): string | undefined => {
	const h = Number(hours) || 0;
	const m = Number(minutes) || 0;
	const s = Number(seconds) || 0;

	if (!h && !m && !s) {
		return undefined;
	}

	return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}`;
};

/** Hours/minutes/seconds inputs composed into an ISO 8601 duration. */
export function DurationInput({
	label,
	onChange,
	value,
}: {
	label: string;
	onChange: (value: DurationValue) => void;
	value: DurationValue;
}) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-1.5">
			<Label>{label}</Label>
			<div className="flex gap-2">
				{(["hours", "minutes", "seconds"] as const).map(unit => (
					<Input
						key={unit}
						aria-label={t(`add.${unit}`)}
						className="flex-1"
						inputMode="numeric"
						min={0}
						placeholder={t(`add.${unit}`)}
						type="number"
						value={value[unit]}
						onChange={event => onChange({ ...value, [unit]: event.target.value })}
					/>
				))}
			</div>
		</div>
	);
}

/** Category select driving the adaptive add/track forms. */
export function CategorySelect({
	categories,
	onChange,
	value,
}: {
	categories: readonly string[];
	onChange: (value: string) => void;
	value: string;
}) {
	const { t } = useTranslation();

	return (
		<FormField label={t("add.category")} htmlFor="category">
			<Select id="category" value={value} onChange={event => onChange(event.target.value)}>
				{categories.map(each => (
					<option key={each} value={each}>
						{t(`category.${each}` as any)}
					</option>
				))}
			</Select>
		</FormField>
	);
}
