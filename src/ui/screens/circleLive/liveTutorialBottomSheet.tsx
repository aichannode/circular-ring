import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { CheckBox } from "@ui/components/checkBox";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React, { useState } from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

enum TutorialStep {
	ONE = "ONE",
	TWO = "TWO",
}
interface LiveTutorialBottomSheetProps {
	onFinish: () => void;
}

export const LiveTutorialBottomSheet: React.FC<LiveTutorialBottomSheetProps> = ({ onFinish }) => {
	const { format } = useI18n();
	const [step, setStep] = useState(TutorialStep.ONE);
	const [tutorialHidden, setTutorialHidden] = useState(false);
	const { userPreferencesService } = useServices();

	return (
		<Container>
			{step === TutorialStep.ONE ? (
				<Stack gap={35} align="center">
					<SecondaryText style={{ textAlign: "center" }}>{format("live.tutorial.warning")}</SecondaryText>
					<Image source={require("@assets/images/liveTutorial1.png")} />
					<SecondaryText style={{ textAlign: "center" }}>{format("live.tutorial.accuracy")}</SecondaryText>
				</Stack>
			) : (
				<Stack gap={50} align="center">
					<Image source={require("@assets/images/liveTutorial2.png")} />
					<SecondaryText style={{ textAlign: "center" }}>{format("live.tutorial.fist")}</SecondaryText>
				</Stack>
			)}
			<Stack gap={60} align="center">
				<CheckBox value={tutorialHidden} onChange={setTutorialHidden} label={format("live.tutorial.hide")} />
				{step === TutorialStep.ONE ? (
					<PrimaryButton onPress={() => setStep(TutorialStep.TWO)}>{format("continue")}</PrimaryButton>
				) : (
					<Row gap={35}>
						<SecondaryButton style={{ minWidth: 100 }} onPress={() => setStep(TutorialStep.ONE)}>
							{format("back")}
						</SecondaryButton>
						<PrimaryButton
							style={{ minWidth: 100 }}
							onPress={() => {
								tutorialHidden && userPreferencesService.skipLiveTutorial();
								onFinish();
							}}
						>
							{format("ok")}
						</PrimaryButton>
					</Row>
				)}
			</Stack>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	padding-top: 20px;
	padding-bottom: 40px;
`;
