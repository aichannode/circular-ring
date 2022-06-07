import { Language } from "@domain/user/user";
import * as RNLocalize from "react-native-localize";
import { LocaleType } from "../wordings";

const defaultLanguageCode = Language.EN;

export function getPreferredLangageCode(candidates: string[]): LocaleType {
	const result = RNLocalize.findBestAvailableLanguage(candidates) || { languageTag: defaultLanguageCode };

	return result.languageTag as LocaleType;
}
