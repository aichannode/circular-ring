import { PairingScreen } from "@ui/pairingScreen/pairingScreen";
import React from "react";
import { IntlProvider } from "react-intl";
import { LogBox } from "react-native";
import * as RNLocalize from "react-native-localize";
import { ServicesProvider } from "./core/services";
import { translations } from "./wordings";

LogBox.ignoreLogs(["new NativeEventEmitter()"]);

export const App = () => {
	const locale = getPreferredLangageCode(Object.keys(translations)) as "en";

	return (
		<IntlProvider locale={locale} messages={translations[locale]}>
			<ServicesProvider>
				<PairingScreen />
			</ServicesProvider>
		</IntlProvider>
	);
};

const defaultLanguageCode = "en";

function getPreferredLangageCode(candidates: string[]): string {
	const result = RNLocalize.findBestAvailableLanguage(candidates) || { languageTag: defaultLanguageCode };
	return result.languageTag;
}
