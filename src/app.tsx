import { useSentry } from "@core/logger/hooks/useSentry";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "@ui/navigation/rootNavigator";
import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { LogBox } from "react-native";
import * as RNLocalize from "react-native-localize";
import { initializeServices, ServicesProvider } from "@core/services";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { translations } from "./wordings";
import SplashScreen from "react-native-splash-screen";

LogBox.ignoreLogs(["new NativeEventEmitter()"]);

// @refresh reset
export const App = () => {
	const locale = getPreferredLangageCode(Object.keys(translations)) as "en";
	const [initialized, setInitialized] = useState(false);
	useSentry();

	useEffect(() => {
		initializeServices().then(() => {
			setInitialized(true);
			SplashScreen.hide();
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
