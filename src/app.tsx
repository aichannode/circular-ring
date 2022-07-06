// Because importing storybook after some of the bellow imports will cause a runtime error (in release version), we need to import storybook before any of the bellow imports.
import { useSentry } from "@core/logger/hooks/useSentry";
import { RepresentationsProvider } from "@core/representation";
import { initializeServices, ServicesProvider } from "@core/services";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import StorybookUIRoot from "@stories";
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
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import { LocaleType, translations } from "./wordings";
import { Language } from "@domain/user/user";
import { getPreferredLangageCode } from "@utils/getPreferredLangageCode";
import moment from "moment";

import "moment/locale/de";
import "moment/locale/es";
import "moment/locale/fr";
import "moment/locale/it";
import "moment/locale/nl";
import CodePush from "react-native-code-push";
import { options } from "@utils/codepush";

// Setup Mobx for RN
configure({
	// enforceActions: "always",
	computedRequiresReaction: true,
	reactionRequiresObservable: true,
	observableRequiresReaction: true,
	useProxies: "never",
	enforceActions: "never",
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
const App = () => {
	CodePush.sync(
		{},
		(status) => console.log("UPDATE STATUS: ", status),
		(progress) => console.log("DOWNLOAD PROGRESS", progress),
		(update) => console.log("MISMATCH", update)
	);
	// For some reason it can't be done in the main script
	const [locale, setLocale] = useState<LocaleType>(getPreferredLangageCode(Object.keys(translations)));
	const [initialized, setInitialized] = useState(false);
	const [isStoryBookDisplayed, toggleStoryBook] = useState(false);

	useSentry();

	useEffect(() => {
		initializeServices().then(() => {
			setInitialized(true);
			SplashScreen.hide();
		});

		// Add Storybook toggle command to the menu
		if (__DEV__) {
			DevSettings.addMenuItem("Toggle Storybook", function () {
				toggleStoryBook((isDisplayed) => !isDisplayed);
			});
		}
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
		moment.locale(locale);
	}, [locale]);

	const onChangeLanguage = (newLocale: LocaleType) => {
		setLocale(newLocale);
	};

	if (isStoryBookDisplayed) {
		return (
			<IntlProvider
				locale={locale}
				messages={translations[locale]}
				onError={() => {
					// XXX: Do not log unmeaningful errors. (https://circularing.atlassian.net/jira/software/projects/CIR/boards/1?selectedIssue=CIR-961)
					// logger.error(err);
					//__DEV__ && console.warn(err);
				}}
			>
				<StorybookUIRoot />
			</IntlProvider>
		);
	} else {
		return initialized ? (
			<IntlProvider
				locale={locale}
				defaultLocale={Language.EN}
				messages={translations[locale]}
				onError={() => {
					// XXX: Do not log unmeaningful errors. (https://circularing.atlassian.net/jira/software/projects/CIR/boards/1?selectedIssue=CIR-961)
					// logger.error(err);
					//					__DEV__ && console.warn(err);
				}}
			>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<StatusBar translucent={true} barStyle="dark-content" backgroundColor="transparent" />
					<SafeAreaProvider>
						<ServicesProvider>
							<RepresentationsProvider>
								<NavigationContainer theme={theme}>
									<BottomSheetModalProvider>
										<RootNavigator onChangeLanguage={onChangeLanguage} />
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

export default CodePush(options())(App);
