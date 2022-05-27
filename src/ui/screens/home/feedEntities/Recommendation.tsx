import { getFeedEntityDate } from "@domain/feed/business";
import {
	Activity,
	FeedEntityComponentType,
	FeedEntityStyle,
	FeedRecommendation,
	ParagraphComponentConfigurationDto,
	UserInputComponentConfigurationDto,
} from "@domain/feed/type";
import { useUserSettings } from "@domain/user/hooks/useUser";
import MaskedView from "@react-native-masked-view/masked-view";
import { Row, row, Stack } from "@ui/components/layout";
import { MetaDataText, SubTitleText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { ColorValue, Image, StyleProp, Text, TextProps, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";
import { getGradient } from "../business";
import { Paragraph } from "../components/Paragraph";
import { UserInput } from "../components/UserInput";

type Props = {
	recommendation: FeedRecommendation;
	style?: StyleProp<ViewStyle>;
};

function getColorFromBannerStyle(style: Activity["style"]): ColorValue | undefined {
	switch (style) {
		case FeedEntityStyle.WHITE_WITH_RED_BORDER:
			return colors.red;
		case FeedEntityStyle.WHITE_WITH_BLUE_BORDER:
			return colors.blue;
		case FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER:
			return colors.darkBlue;
		default:
			return undefined;
	}
}

const GradientText = ({
	stops,
	style,
	textElement: TextElement,
	...props
}: TextProps & {
	stops: ReadonlyArray<string>;
	textElement: React.ElementType<TextProps>;
}) => {
	return (
		<MaskedView maskElement={<TextElement style={style} {...props} />}>
			<LinearGradient colors={stops.slice(0)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
				<Text {...props} style={[style, { opacity: 0 }]} />
			</LinearGradient>
		</MaskedView>
	);
};

export default GradientText;

export const Recommendation: React.FC<Props> = ({ recommendation }) => {
	const highlightColor = getColorFromBannerStyle(recommendation.style);
	const userSettings = useUserSettings();
	const todayIso = new Date().toISOString();
	const { format } = useI18n();
	const userInput = recommendation.components.find(({ type }) => type === FeedEntityComponentType.USER_INPUT) as
		| UserInputComponentConfigurationDto
		| undefined;
	const paragraphs = recommendation.components.filter(({ type }) => type === FeedEntityComponentType.PARAGRAPH) as
		| ParagraphComponentConfigurationDto[];
	const maybeGradientBorder = getGradient(recommendation.style as FeedEntityStyle);

	return (
		<>
			<Container style={recommendation.style}>
				{maybeGradientBorder && (
					<LinearGradient
						colors={maybeGradientBorder.slice(0)}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{
							position: "absolute",
							left: -10,
							top: 0,
							bottom: 0,
							width: 10,
							borderTopLeftRadius: 2,
							borderBottomLeftRadius: 2,
						}}
					/>
				)}
				<Stack gap={10} style={{ flex: 1 }}>
					{/* Use a wrapper to set the gutter so hat Separator will be at full width */}
					<View style={{ paddingTop: 20, paddingRight: 26, paddingBottom: 10, paddingLeft: 30 }}>
						<Row style={{ alignItems: "center", justifyContent: "space-between" }}>
							<TitleText>{format(recommendation.title).toUpperCase()}</TitleText>
							{maybeGradientBorder ? (
								<GradientText stops={maybeGradientBorder} textElement={SubTitleText} style={{ textAlign: "right" }}>
									{format(recommendation.secondaryTitle)}
								</GradientText>
							) : (
								<SubTitleText style={{ color: highlightColor, textAlign: "right" }}>
									{format(recommendation.secondaryTitle)}
								</SubTitleText>
							)}
						</Row>
					</View>
					<Separator />
					<View style={{ paddingRight: 26, paddingBottom: 17, paddingLeft: 30 }}>
						<Row style={{ alignItems: "center", marginBottom: 8 }}>
							<Image
								style={{ width: 14, height: 14, marginRight: 8 }}
								source={require("@assets/images/clockGrey.png")}
							/>
							<MetaDataText>
								{getFeedEntityDate(recommendation.startDate, todayIso, userSettings?.hourFormat)}
							</MetaDataText>
						</Row>
						{paragraphs.map((paragraph, key) => (
							<Paragraph
								key={paragraph.id}
								coloredTagColor={highlightColor}
								{...(paragraph as ParagraphComponentConfigurationDto).configuration}
							/>
						))}
					</View>
				</Stack>
			</Container>
			{userInput && (
				<UserInput
					feedEntryId={recommendation.id}
					compId={userInput.id}
					palette={recommendation.style}
					{...userInput}
				/>
			)}
		</>
	);
};

const Container = styled.View<{ style: Activity["style"] }>`
	${row("center")};
	margin-top: 15px;
	border-left-width: 10px;
	background-color: white;
	border-radius: 2px;
	${(props) => `border-left-color: ${getColorFromBannerStyle(props.style) as string}`};
`;

const Separator = styled.View`
	height: 1px;
	background-color: ${colors.midGray};
`;
