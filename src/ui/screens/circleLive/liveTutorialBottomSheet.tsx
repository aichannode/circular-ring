import { useServices } from "@core/services";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CircularBottomSheet } from "@ui/components/bottomSheet";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { CheckBox } from "@ui/components/checkBox";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React, { useImperativeHandle, useRef, useState } from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

enum TutorialStep {
	ONE = "ONE",
	TWO = "TWO",
}
interface LiveTutorialBottomSheetProps {
	onFinish: () => void;
}
export const LiveTutorialBottomSheet = React.forwardRef<BottomSheetModal | null, LiveTutorialBottomSheetProps>(
	({ onFinish }, ref) => {
		const { format } = useI18n();
		const bottomSheet = useRef<BottomSheetModal>(null);
		const [step, setStep] = useState(TutorialStep.ONE);
		const [tutorialHidden, setTutorialHidden] = useState(false);
		const { userPreferencesService } = useServices();

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		useImperativeHandle(ref, () => bottomSheet.current!, []);

		return (
			<CircularBottomSheet snapPoints={[610]} ref={bottomSheet}>
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
										userPreferencesService.skipLiveTutorial();
										onFinish();
										bottomSheet.current?.close();
									}}
								>
									{format("ok")}
								</PrimaryButton>
							</Row>
						)}
					</Stack>
				</Container>
			</CircularBottomSheet>
		);
	}
);

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	padding-top: 20px;
	padding-bottom: 40px;
`;
