import { colors } from "@ui/styles/colors";
import React, { useCallback, useEffect, useState } from "react";
import CountryPicker, { Country } from "react-native-country-picker-modal";
import styled from "styled-components/native";

interface CountryFieldProps {
	title?: string;
	placeholder?: string;
	onValueChanged?: (value: string) => void;
	defaultCountryCode?: string;
	authorizedCountries?: string[];
	isError?: boolean;
}

export const CountryField = (props: CountryFieldProps) => {
	const [country, setCountry] = useState<Country | undefined>(undefined);

	const onCountryChanged = useCallback(
		(selectedCountry: Country) => {
			setCountry(selectedCountry);
			if (props.onValueChanged) {
				props.onValueChanged(selectedCountry.cca2);
			}
		},
		[props]
	);

	useEffect(() => {
		if (props.onValueChanged && props.defaultCountryCode) {
			if (country === undefined) {
				props.onValueChanged(props.defaultCountryCode);
			}
		}
	}, [country, props]);

	return (
		<Container>
			{props.title ? <Title>{props.title}</Title> : null}
			<InputView>
				{country || props.defaultCountryCode ? null : <Placeholder>{props.placeholder}</Placeholder>}
				<CountryContainer>
					<CountryPicker
						theme={{
							fontSize: 15,
							onBackgroundTextColor: colors.textPrimary,
						}}
						withCountryNameButton
						withFlagButton={false}
						// @ts-ignore
						preferredCountries={props.defaultCountryCode ? [props.defaultCountryCode] : undefined}
						// @ts-ignore
						countryCode={country !== undefined ? country.cca2 : props.defaultCountryCode}
						onSelect={onCountryChanged}
						closeButtonImage={require("@assets/images/close.png")}
						closeButtonImageStyle={{ height: 16, width: 16 }}
						closeButtonStyle={{
							alignItems: "flex-end",
							justifyContent: "flex-end",
							flexGrow: 1,
							marginRight: 15,
							height: 32,
						}}
						placeholder={""}
						// @ts-ignore
						countryCodes={props.authorizedCountries ? props.authorizedCountries : undefined}
						translation={props.defaultCountryCode === "FR" ? "fra" : undefined}
					/>
					<Chevron source={require("@assets/images/icon-chevron-down.png")} tintColor={colors.textPrimary} />
				</CountryContainer>
			</InputView>
		</Container>
	);
};

const Container = styled.View`
	width: 100%;
`;

const Title = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
	margin-bottom: 16px;
`;

const InputView = styled.View`
	border-bottom-color: ${colors.textPrimary};
	border-bottom-width: 1px;
	width: 100%;
	padding: 0;
`;

const Placeholder = styled.Text`
	position: absolute;
	top: 2px;
	left: 8px;
	font-size: 14px;
	color: ${colors.textPlaceholder};
`;

const CountryContainer = styled.View`
	flex-grow: 1;
	padding: 0;
	margin-bottom: 4px;
	margin-left: 8px;
`;

const Chevron = styled.Image<{ tintColor: string }>`
	position: absolute;
	top: 0;
	right: 0;
	opacity: 0.4;
	tint-color: ${(props) => props.tintColor};
	overflow: visible;
`;
