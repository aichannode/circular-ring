import React from "react";
import { IntlProvider } from "react-intl";
import { Text } from "react-native";
import * as RNLocalize from "react-native-localize";
import styled from "styled-components/native";
import { translations } from "./wordings";

export const App = () => {
	const locale = getPreferredLangageCode(Object.keys(translations));

	return (
		<IntlProvider locale={locale} messages={translations[locale]}>
			<Container>
				<Text>Circular Ring</Text>
			</Container>
		</IntlProvider>
	);
};

const Container = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

const defaultLanguageCode = "en";

function getPreferredLangageCode(candidates: string[]): string {
	const result = RNLocalize.findBestAvailableLanguage(candidates) || { languageTag: defaultLanguageCode };
	return result.languageTag;
}
