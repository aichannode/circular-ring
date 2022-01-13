/* eslint-disable @typescript-eslint/ban-ts-comment */
import { colors } from "@ui/styles/colors";
import React from "react";
import CountryPicker from "react-native-country-picker-modal";
import styled from "styled-components/native";

interface CountryFieldProps {
	title?: string;
	placeholder?: string;
	onCountryCodeChanged: (value: string) => void;
	countryCode?: string;
	authorizedCountries?: string[];
	isError?: boolean;
}

export const CountryField = (props: CountryFieldProps) => (
	<Container>
		{props.title ? <Title>{props.title}</Title> : null}
		<InputView>
			{props.countryCode ? null : <Placeholder>{props.placeholder}</Placeholder>}
			<CountryContainer>
				<CountryPicker
					theme={{
						fontSize: 15,
						onBackgroundTextColor: colors.textPrimary,
					}}
					withCountryNameButton
					withFlagButton={false}
					// @ts-ignore
					preferredCountries={props.countryCode ? [props.countryCode] : undefined}
					// @ts-ignore
					countryCode={props.countryCode}
					onSelect={(country) => props.onCountryCodeChanged(country.cca2)}
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
				/>
				<Chevron source={require("@assets/images/icon-chevron-down.png")} tintColor={colors.textPrimary} />
			</CountryContainer>
		</InputView>
	</Container>
);

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
