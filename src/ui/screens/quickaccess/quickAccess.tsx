import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import styled from "styled-components/native";
import LinearGradient from "react-native-linear-gradient";

export const QuickAccess: React.FC = () => {
	const { format } = useI18n();

	return (
		<Container>
			<Description>{format("quickaccess.description")}</Description>
			<Label>{format("quickaccess.displayed")}</Label>
			<QuickAccessContainer colors={[colors.orangeGradientEnd, colors.orangeGradientStart]}>
				<InnerContainer>
					<Draggable source={require("@assets/images/group.png")}></Draggable>
					<RightContainer>
						<Title>{format("quickaccess.sleeptitle")}</Title>
						<TileDesc>{format("quickaccess.sleepdesc")}</TileDesc>
					</RightContainer>
				</InnerContainer>
			</QuickAccessContainer>
			<Label>{format("quickaccess.hidden")}</Label>
		</Container>
	);
};

const Title = styled.Text`
	font-size: 18px;
	color: white;
	font-weight: 500;
	margin-vertical: 4;
`;

const TileDesc = styled.Text`
	color: white;
`;

const RightContainer = styled.View`
	flex: 1;
	border-left-width: 1;
	border-left-color: white;
	margin-vertical: 8;
	padding-left: 10;
`;

const InnerContainer = styled.View`
	display: flex;
	flex-direction: row;
`;

const Draggable = styled.Image`
	height: 40px;
	margin-vertical: 22;
`;

const Label = styled.Text`
	font-size: 18px;
	margin-vertical: 14;
`;

const Description = styled.Text`
	font-size: 18px;
	color: ${colors.textSecondary};
	font-weight: 500;
	padding-bottom: 20;
	padding-top: 10;
	border-bottom-width: 0.5;
	border-bottom-color: ${colors.gray};
`;

const QuickAccessContainer = styled(LinearGradient)`
	height: 84px;
	width: 100%;
	border-radius: 8px;
`;

const Container = styled(ScrollScreen)`
	padding: 24px 24px;
	width: 100%;
`;
