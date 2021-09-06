import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { useEffect } from "react";
import { IntlProvider } from "react-intl";
import { LogBox } from "react-native";
import * as RNLocalize from "react-native-localize";
import { initializeServices, ServicesProvider } from "./core/services";
import { RootNavigator } from "./rootNavigator";
import { translations } from "./wordings";
import { SafeAreaProvider } from "react-native-safe-area-context";

LogBox.ignoreLogs(["new NativeEventEmitter()"]);

// @refresh reset
export const App = () => {
	const locale = getPreferredLangageCode(Object.keys(translations)) as "en";
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		initializeServices().then(() => {
			setInitialized(true);
		});
	}, []);

	return initialized ? (
		<IntlProvider locale={locale} messages={translations[locale]}>
			<SafeAreaProvider>
				<ServicesProvider>
					<NavigationContainer>
						<RootNavigator />
					</NavigationContainer>
				</ServicesProvider>
			</SafeAreaProvider>
		</IntlProvider>
	) : null;
};

const defaultLanguageCode = "en";

function getPreferredLangageCode(candidates: string[]): string {
	const result = RNLocalize.findBestAvailableLanguage(candidates) || { languageTag: defaultLanguageCode };
	return result.languageTag;
}
