import React from "react";
import { SecondaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView, Stack } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { colors } from "@ui/styles/colors";
import { Image } from "react-native";

import styled from "styled-components/native";

import { useI18n } from "@ui/i18n";

export const SetUpFailed = ({
	isConnecting,
	setError,
	fullScreen,
}: {
	isConnecting: boolean;
	setError: (arg0: boolean) => void;
	fullScreen: boolean;
}) => {
	const { format } = useI18n();
	return (
		<>
			<ErrorContainer>
				<ErrorText fullScreen={fullScreen}>{format("setup.connection.failed.title")}</ErrorText>
			</ErrorContainer>
			<Container>
				<ResponsiveCenterView>
					<Stack align="center">
						<Image source={require("@assets/images/ringShadow.png")} style={{ position: "absolute" }} />
						<RingSeparator />
						<Image source={require("@assets/images/ringBig.png")} />
						<Message>{format("setup.connection.failed.message")}</Message>
					</Stack>
				</ResponsiveCenterView>
			</Container>
			<SecondaryButton style={{ marginTop: 70 }} onPress={() => setError(false)}>
				{format("try_again")}
			</SecondaryButton>
		</>
	);
};

const Container = styled.View`
	flex: 1;
	display: flex;
	justify-content: space-around;
`;

const ErrorContainer = styled.View`
	background-color: ${colors.redOrange};
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
`;

const ErrorText = styled.Text<{ fullScreen: boolean }>`
	color: white;
	font-size: 16px;
	padding: 5px;
	text-align: center;
	padding-top: ${(props) => (props.fullScreen ? "48px" : "5px")};
`;

const Message = styled(SecondaryText)`
	margin-top: 80px;
	margin-bottom: 40px;
	text-align: center;
`;

const RingSeparator = styled.View`
	margin-top: 40px;
`;
