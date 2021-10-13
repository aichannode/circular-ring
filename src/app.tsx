import "react-native-gesture-handler";
import "react-native-get-random-values";
import { useSentry } from "@core/logger/hooks/useSentry";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { RootNavigator } from "@ui/navigation/rootNavigator";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect, useState } from "react";
import { createIntl, IntlProvider } from "react-intl";
import { LogBox, StatusBar, Platform, UIManager } from "react-native";
import * as RNLocalize from "react-native-localize";
import { initializeServices, ServicesProvider } from "@core/services";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { translations } from "./wordings";
import SplashScreen from "react-native-splash-screen";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import utc from "dayjs/plugin/utc";
import { LocaleConfig } from "react-native-calendars";

LogBox.ignoreLogs(["new NativeEventEmitter()"]);
dayjs.extend(customParseFormat);
dayjs.extend(utc);

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "white" } };

// @refresh reset
export const App = () => {
	const locale = getPreferredLangageCode(Object.keys(translations)) as "en"; // For some reason it can't be done in the main script
	const [initialized, setInitialized] = useState(false);
	useSentry();

	useEffect(() => {
		initializeServices().then(() => {
			setInitialized(true);
			SplashScreen.hide();
		});
	}, []);

	useEffect(() => {
		const intl = createIntl({ locale, messages: translations[locale] });
		for (const loc of Object.keys(translations)) {
			LocaleConfig.locales[loc] = {
				monthNames: intl.formatMessage({ id: "months" }).split(","),
				monthNamesShort: intl.formatMessage({ id: "months_short" }).split(","),
				dayNames: intl.formatMessage({ id: "days" }).split(","),
				dayNamesShort: intl.formatMessage({ id: "days_short" }).split(","),
				today: intl.formatMessage({ id: "today" }),
			};
		}
		LocaleConfig.defaultLocale = locale;
	}, []);

	return initialized ? (
		<IntlProvider locale={locale} messages={translations[locale]}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<StatusBar translucent={true} barStyle="dark-content" backgroundColor="transparent" />
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
