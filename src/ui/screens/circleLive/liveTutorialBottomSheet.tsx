import { useServices } from "@core/services";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { CheckBox } from "@ui/components/checkBox";
import { ResponsiveCenterView, Row, Stack } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { useObservable } from "micro-observables";
import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, Image, View } from "react-native";
import styled from "styled-components/native";

enum TutorialStep {
	ONE = "ONE",
	TWO = "TWO",
}
interface LiveTutorialBottomSheetProps {
	onFinish: (hideTutorial: boolean) => void;
}

export const LiveTutorialBottomSheet: React.FC<LiveTutorialBottomSheetProps> = ({ onFinish }) => {
	const { format } = useI18n();
	const [step, setStep] = useState(TutorialStep.ONE);
	const [tutorialHidden, setTutorialHidden] = useState(false);
	const { appStateService } = useServices();
	const showWarning = useObservable(appStateService.showLiveCircleWaringBottomSheet);
	const [skipWarning, setSkipWarning] = useState(false);
	const [hideTutorialWarning, setHideTutorialWarning] = useState(false);
	console.log("showWarning", showWarning);

	const backToStepOne = useCallback(() => {
		setStep(TutorialStep.ONE);
		return true;
	}, []);

	useEffect(() => {
		if (step === TutorialStep.ONE) {
			BackHandler.removeEventListener("hardwareBackPress", backToStepOne);
		} else {
			BackHandler.addEventListener("hardwareBackPress", backToStepOne);
			return () => BackHandler.removeEventListener("hardwareBackPress", backToStepOne);
		}
	}, [step]);

	if (showWarning !== false && !skipWarning)
		return (
			<Container style={{ flex: 1, justifyContent: "space-between", alignContent: "center" }}>
				<View style={{ flex: 1, justifyContent: "space-evenly", alignContent: "center" }}>
					<View>
						<SecondaryText style={{ textAlign: "center" }}>{format("live.tutorial.not.medical.warning")}</SecondaryText>
						<SecondaryText style={{ textAlign: "center", marginTop: 30 }}>
							{format("live.tutorial.not.medical.warning2")}
						</SecondaryText>
					</View>
					<CheckBox
						value={hideTutorialWarning}
						onChange={setHideTutorialWarning}
						label="I understand, don’t show this message again"
					/>
				</View>
				<PrimaryButton
					onPress={() => {
						setSkipWarning(true);
						if (hideTutorialWarning) appStateService.showLiveCircleWaringBottomSheet.set(false);
					}}
				>
					{format("continue")}
				</PrimaryButton>
			</Container>
		);

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
								onFinish(tutorialHidden);
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
