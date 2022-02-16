import { Grow } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { Switch } from "@ui/components/switch";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { TouchableOpacity, ViewProps, ViewStyle } from "react-native";
import styled from "styled-components/native";

export const InfoListHeader: React.FC<ViewProps> = ({ children, style }) => {
	return <InfoListHeaderText style={style}>{children}</InfoListHeaderText>;
};

const InfoListHeaderText = styled.Text`
	${textStyles.mediumTitle};
	margin-vertical: 25px;
	align-self: flex-start;
	margin-left: 20px;
`;

interface InfoListItemProps<T> {
	name: string;
	value?: string;

	emphasize?: boolean;

	action?: () => void;
	hasDisclosure?: boolean;

	switchOptions?: T[];
	switchValue?: T;
	onSwitchSelect?: (option: T) => void;

	checkable?: boolean;
	checked?: boolean;

	style?: ViewStyle;
	errorMessage?: string;
	loading?: boolean;
	disabled?: boolean;
	children?: React.ReactElement;
	lightTheme?: boolean;
}

export function InfoListItem<T>({
	name,
	value,
	emphasize = false,
	action,
	hasDisclosure = false,
	switchOptions,
	switchValue,
	onSwitchSelect,
	checkable,
	checked,
	style,
	errorMessage,
	loading,
	disabled = false,
	children,
	lightTheme = false,
}: InfoListItemProps<T>) {
	return (
		<>
			<TouchableOpacity onPress={() => (disabled ? null : action?.())}>
				<Container style={style} lightTheme={lightTheme}>
					<Name emphasize={emphasize} disabled={disabled && !lightTheme}>
						{name}
					</Name>
					<Grow />
					{loading ? (
						<Spinner size={18} />
					) : (
						<>
							{value && !disabled && (
								<Value numberOfLines={1} ellipsizeMode={"tail"}>
									{value}
								</Value>
							)}
							{switchOptions && switchValue && onSwitchSelect && (
								<Switch
									options={switchOptions}
									containerBgColor={colors.lightgray}
									currentOption={switchValue}
									onSelectOption={onSwitchSelect}
									disabled={disabled}
								/>
							)}
						</>
					)}
					{!!checkable && (
						<Check selected={!!checked}>
							{!!checked && <CheckIcon source={require("@assets/images/checkSmall.png")} tintColor={colors.white} />}
						</Check>
					)}
					{children}
					{hasDisclosure && (
						<Disclosure
							source={require("@assets/images/disclosure.png")}
							disabled={disabled}
							tintColor={disabled ? colors.disabled : colors.textPlaceholder}
						/>
					)}
				</Container>
			</TouchableOpacity>
			{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
		</>
	);
}

const Container = styled.View<{ lightTheme: boolean }>`
	width: 100%;
	height: 50px;
	padding: 0 20px;
	flex-direction: row;
	align-items: center;
	margin-bottom: 1px;
	background-color: ${(props) => (props.lightTheme ? colors.white : colors.lightgray)};
	border-bottom-width: ${(props) => (props.lightTheme ? "1px" : "0px")};
	border-bottom-color: ${colors.lightgray};
`;

const Name = styled.Text<{ emphasize: boolean; disabled: boolean }>`
	${textStyles.primary};
	font-size: 14px;
	color: ${({ emphasize, disabled }) =>
		disabled ? colors.disabled : emphasize ? colors.orangeRed : colors.textPrimary};
	max-width: 75%;
`;

const Value = styled.Text`
	font-size: 14px;
	font-weight: 500;
	color: ${colors.textPlaceholder};
	flex-shrink: 1;
	margin-left: 10px;
`;

const Disclosure = styled.Image<{ disabled: boolean; tintColor: string }>`
	margin-left: 13px;
	tint-color: ${({ tintColor }) => tintColor};
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	padding: 0 20px;
`;

const Check = styled.View<{ selected: boolean }>`
	width: 24px;
	height: 24px;
	justify-content: center;
	align-items: center;
	background-color: ${({ selected }) => (selected ? colors.primary : "transparent")};
	border-radius: 12px;
	border-width: ${({ selected }) => (selected ? 0 : 1)}px;
	border-color: ${colors.gray};
`;

const CheckIcon = styled.Image<{ tintColor: string }>`
	height: 14px;
	flex-shrink: 1;
	tint-color: ${(props) => props.tintColor};
	resize-mode: contain;
`;
