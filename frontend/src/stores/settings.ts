import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "dark" | "light";

export interface SettingsState {
	setTheme: (theme: Theme) => void;
	theme: Theme;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		set => ({
			setTheme: theme => set({ theme }),
			theme: "dark",
		}),
		{
			name: "enki-settings",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
