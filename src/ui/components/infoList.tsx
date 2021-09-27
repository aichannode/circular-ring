import { Grow } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { Switch } from "@ui/components/switch";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, ViewProps, ViewStyle } from "react-native";
import styled from "styled-components/native";

export const InfoListHeader: React.FC<ViewProps> = ({ children }) => {
	return <InfoListHeaderText>{children}</InfoListHeaderText>;
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
	style?: ViewStyle;
	errorMessage?: string;
	loading?: boolean;
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
	style,
	errorMessage,
	loading,
}: InfoListItemProps<T>) {
	return (
		<>
			<Pressable onPress={() => action?.()}>
				<Container style={style}>
					<Name emphasize={emphasize}>{name}</Name>
					<Grow />
					{loading ? (
						<Spinner size={18} />
					) : (
						<>
							{value && (
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
								/>
							)}
						</>
					)}
					{hasDisclosure && <Disclosure source={require("@assets/images/disclosure.png")} />}
				</Container>
			</Pressable>
			{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
		</>
	);
}

const Container = styled.View`
	width: 100%;
	height: 50px;
	padding: 0 20px;
	flex-direction: row;
	align-items: center;
	margin-bottom: 1px;
	background-color: ${colors.lightgray};
`;

const Name = styled.Text<{ emphasize: boolean }>`
	${textStyles.primary};
	font-size: 14px;
	color: ${({ emphasize }) => (emphasize ? colors.red : colors.textPrimary)};
`;

const Value = styled.Text`
	font-size: 14px;
	font-weight: 500;
	color: ${colors.textPlaceholder};
	flex-shrink: 1;
	margin-left: 10px;
`;

const Disclosure = styled.Image`
	margin-left: 13px;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	padding: 0 20px;
`;
