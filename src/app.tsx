import "react-native-gesture-handler";
import { useSentry } from "@core/logger/hooks/useSentry";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { RootNavigator } from "@ui/navigation/rootNavigator";
import React, { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { LogBox } from "react-native";
import * as RNLocalize from "react-native-localize";
import { initializeServices, ServicesProvider } from "@core/services";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { translations } from "./wordings";
import SplashScreen from "react-native-splash-screen";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

LogBox.ignoreLogs(["new NativeEventEmitter()"]);

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "white" } };
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
			<GestureHandlerRootView style={{ flex: 1 }}>
				<SafeAreaProvider>
					<ServicesProvider>
						<NavigationContainer theme={theme}>
							<BottomSheetModalProvider>
								<RootNavigator />
							</BottomSheetModalProvider>
						</NavigationContainer>
					</ServicesProvider>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</IntlProvider>
	) : null;
};

const defaultLanguageCode = "en";

function getPreferredLangageCode(candidates: string[]): string {
	const result = RNLocalize.findBestAvailableLanguage(candidates) || { languageTag: defaultLanguageCode };
	return result.languageTag;
}
