import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US.json";
import ptPT from "./locales/pt-PT.json";

export const supportedLngs = ["en-US", "pt-PT"] as const;

if (!i18n.isInitialized) {
	i18n
		.use(LanguageDetector)
		.use(initReactI18next)
		.init({
			defaultNS: "common",
			detection: {
				caches: ["localStorage"],
				lookupLocalStorage: "lang",
				order: ["localStorage", "navigator", "htmlTag"],
			},
			fallbackLng: "en-US",
			interpolation: { escapeValue: false },
			load: "currentOnly",
			resources: {
				"en-US": enUS,
				"pt-PT": ptPT,
			},
			supportedLngs: [...supportedLngs],
		});
}

export default i18n;
