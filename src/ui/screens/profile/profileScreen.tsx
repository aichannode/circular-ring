import { getScoreQuality } from "@domain/circleActivity/circleActivityData";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CircularBottomSheet } from "@ui/components/bottomSheet";
import { InfoListItem } from "@ui/components/infoListItem";
import { ResponsiveCenterView, Row } from "@ui/components/layout";
import { ScoreView } from "@ui/components/scoreView";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SecondaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { LogoutBottomSheet } from "@ui/screens/profile/logoutBottomSheet";
import { colors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import React, { useRef } from "react";
import { View } from "react-native";
import styled from "styled-components/native";

const score = 82.42; // FAKE
export const ProfileScreen = () => {
	const { format, formatScoreQuality } = useI18n();

	const scoreQuality = score ? getScoreQuality(score, 80, 90) : null;

	const logoutBottomSheetRef = useRef<BottomSheetModal>(null);

	return (
		<ScrollScreen style={{ justifyContent: "flex-start" }} contentContainerStyle={{ paddingTop: 30 }}>
			<ResponsiveCenterView>
				<ScoreCard gap={16} align="center" justify="center">
					<ScoreView value={score} color={colors.primary} />
					<View>
						<SecondaryText>{format("profile.global_score.label")}</SecondaryText>
						{scoreQuality && (
							<TitleText style={{ color: colors.primary }}>{formatScoreQuality(scoreQuality)}</TitleText>
						)}
					</View>
				</ScoreCard>
			</ResponsiveCenterView>
			<SeparatedItem
				name={format("profile.logout")}
				action={() => logoutBottomSheetRef.current?.present()}
				emphasize={true}
			/>
			<CircularBottomSheet snapPoints={[480]} ref={logoutBottomSheetRef}>
				<LogoutBottomSheet onCancel={() => logoutBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</ScrollScreen>
	);
};

const SeparatedItem = styled(InfoListItem)`
	margin-top: 20px;
`;

const ScoreCard = styled(Row)`
	${roundedWhiteCardStyle};
	padding: 25px;
`;
