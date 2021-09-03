import { useSentry } from "@core/logger/hooks/useSentry";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { IntlProvider } from "react-intl";
import { LogBox } from "react-native";
import * as RNLocalize from "react-native-localize";
import { ServicesProvider } from "./core/services";
import { RootNavigator } from "./rootNavigator";
import { translations } from "./wordings";
import SplashScreen from "react-native-splash-screen";

LogBox.ignoreLogs(["new NativeEventEmitter()"]);

export const App = () => {
	const locale = getPreferredLangageCode(Object.keys(translations)) as "en";
	useSentry();

	useEffect(() => {
		SplashScreen.hide();
	}, []);

	return (
		<IntlProvider locale={locale} messages={translations[locale]}>
			<ServicesProvider>
				<NavigationContainer>
					<RootNavigator />
				</NavigationContainer>
			</ServicesProvider>
		</IntlProvider>
	);
};

const defaultLanguageCode = "en";

function getPreferredLangageCode(candidates: string[]): string {
	const result = RNLocalize.findBestAvailableLanguage(candidates) || { languageTag: defaultLanguageCode };
	return result.languageTag;
}
