import en from "./en.json";
import fr from "./fr.json";
import es from "./es.json";
import de from "./de.json";
import it from "./it.json";
import nl from "./nl.json";

export const translations = { en, fr, es, de, it, nl };

export type LocaleType = "en" | "fr" | "es" | "de" | "it" | "nl";

export type WordingKey = keyof typeof en;
