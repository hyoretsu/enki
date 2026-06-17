import { create } from "zustand";

interface DialogEntry {
	confirmLabel?: string;
	message: string;
	resolve: (value: boolean) => void;
	title?: string;
	type: "alert" | "confirm";
}

interface DialogStore {
	close: (value: boolean) => void;
	current: DialogEntry | null;
	show: (
		type: "alert" | "confirm",
		message: string,
		title?: string,
		confirmLabel?: string,
	) => Promise<boolean>;
}

export const useDialogStore = create<DialogStore>((set, get) => ({
	close(value) {
		const { current } = get();
		if (!current) return;
		current.resolve(value);
		set({ current: null });
	},
	current: null,

	show(type, message, title, confirmLabel) {
		return new Promise<boolean>(resolve => {
			set({ current: { confirmLabel, message, resolve, title, type } });
		});
	},
}));

export function showAlert(message: string, title?: string): Promise<void> {
	return useDialogStore
		.getState()
		.show("alert", message, title)
		.then(() => undefined);
}

export function showConfirm(message: string, title?: string, confirmLabel?: string): Promise<boolean> {
	return useDialogStore.getState().show("confirm", message, title, confirmLabel);
}
