import { useLogger } from "@core/logger/hooks/useLogger";
import { useSentry } from "@core/logger/hooks/useSentry";
import { RepresentationsProvider } from "@core/representation";
import { initializeServices, ServicesProvider } from "@core/services";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "@ui/navigation/rootNavigator";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { enableES5 } from "immer";
import { configure } from "mobx";
import React, { useEffect, useState } from "react";
import { createIntl, IntlProvider } from "react-intl";
import { DevSettings, LogBox, Platform, StatusBar, UIManager } from "react-native";
import { LocaleConfig } from "react-native-calendars";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import * as RNLocalize from "react-native-localize";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import StorybookUIRoot from "../storybook";
import { translations } from "./wordings";

// Setup Mobx for RN
configure({
	enforceActions: "always",
	computedRequiresReaction: true,
	reactionRequiresObservable: true,
	observableRequiresReaction: true,
	useProxies: "never",
});

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreLogs(["new NativeEventEmitter()"]);

dayjs.extend(customParseFormat);
dayjs.extend(utc);

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Configure immer for RN
enableES5();

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: "white" } };

// @refresh reset
export const App = () => {
	const locale = getPreferredLangageCode(Object.keys(translations)) as "en"; // For some reason it can't be done in the main script
	const [initialized, setInitialized] = useState(false);
	const [isStoryBookDisplayed, toggleStoryBook] = useState(false);

	useSentry();
	const logger = useLogger("App.tsx");

	useEffect(() => {
		initializeServices().then(() => {
			setInitialized(true);
			SplashScreen.hide();
		});

		// Add Storybook toggle command to the menu
		DevSettings.addMenuItem("Toggle Storybook", function () {
			toggleStoryBook((isDisplayed) => !isDisplayed);
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
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				today: intl.formatMessage({ id: "today" }),
			};
		}
		LocaleConfig.defaultLocale = locale;
	}, []);

	if (isStoryBookDisplayed) {
		return (
			<IntlProvider
				locale={locale}
				messages={translations[locale]}
				onError={(err) => {
					logger.error(err);
				}}
			>
				<StorybookUIRoot />
			</IntlProvider>
		);
	} else {
		return initialized ? (
			<IntlProvider
				locale={locale}
				messages={translations[locale]}
				onError={(err) => {
					logger.error(err);
				}}
			>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<StatusBar translucent={true} barStyle="dark-content" backgroundColor="transparent" />
					<SafeAreaProvider>
						<ServicesProvider>
							<RepresentationsProvider>
								<NavigationContainer theme={theme}>
									<BottomSheetModalProvider>
										<RootNavigator />
									</BottomSheetModalProvider>
								</NavigationContainer>
							</RepresentationsProvider>
						</ServicesProvider>
					</SafeAreaProvider>
				</GestureHandlerRootView>
			</IntlProvider>
		) : null;
	}
};

const defaultLanguageCode = "en";

function getPreferredLangageCode(candidates: string[]): string {
	const result = RNLocalize.findBestAvailableLanguage(candidates) || { languageTag: defaultLanguageCode };

	return result.languageTag;
}
