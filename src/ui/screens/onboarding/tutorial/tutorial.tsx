import styled from "styled-components/native";
import React, { useState, useCallback } from "react";
import { colors } from "@ui/styles/colors";
import { useServices } from "@core/services";
import dayjs from "dayjs";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { Spinner } from "@ui/components/spinner";
import { FakeHeader } from "./fakeHeader";
import { CirclesBanner } from "./fakeCircle";
import { View } from "react-native";
import { Recommendation } from "@ui/screens/home/feedEntities/Recommendation";
import { FakeRecommendation } from "./FakeRecommendation";
import { Explanation } from "./explanation";
import { Mask } from "./mask";
import { recommendationData, recommendationDataFeed } from "./recomandation";
import { FourDot } from "./fourDot";
import { FakeQuiAccess } from "./fakeQuickAccess";
import { useFetchCircles } from "@domain/circles/hooks";
import { DateFormat } from "@domain/units";

export const Tutorial = () => {
	const route = useAppRoute<Routes.OnboardingTutorial>();
	const { firstName, lastName, country, birthDate, sex, weight, height, heightUnit, weightUnit } = route.params;
	const { userService } = useServices();
	const [step, setStep] = useState<number>(0);
	const { navigate } = useRoutesNavigation();
	const [isLoading, setLoading] = useState(false);

	useFetchCircles();

	const completeTutorial = useCallback(async () => {
		setLoading(true);
		const _birthDate = dayjs(birthDate, "DD/MM/YYYY", true).toDate();
		try {
			await userService.completeTutorial({ firstName, lastName, country, birthDate: _birthDate, sex, weight, height });
			await userService.updateUserSettings({
				dateFormat: DateFormat.USCS,
				heightFormat: heightUnit,
				weightFormat: weightUnit,
			});
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}, [birthDate, sex, weight, height]);

	const getPositionOfExplanation = (step: number) => {
		if (step === 0) return 200;
		if (step === 1) return 270;
		if (step === 2) return 425;
		if (step === 3) return 110;
		return 0;
	};

	return (
		<Container>
			<Mask masked={true}>
				<FakeHeader></FakeHeader>
			</Mask>
			<SubContainer>
				<Explanation top={getPositionOfExplanation(step)} step={step} revert={step === 3}></Explanation>
				<Mask masked={step !== 0}>
					<CirclesBanner></CirclesBanner>
				</Mask>
				<View style={{ height: 16, backgroundColor: "rgba(0, 0, 0, 0.65)" }}></View>
				<Mask masked={step !== 1} top={0}>
					<FakeQuiAccess />
					{/* <View></View> */}
				</Mask>
				<View style={{ height: 16, backgroundColor: "rgba(0, 0, 0, 0.65)" }}></View>
				<FakeRecommendation
					maskRecommendation={step !== 2}
					maskUserInput={step !== 3}
					recommendation={recommendationData}
					style={{ margin: 10 }}
				/>
				<Mask masked={true}>
					<Recommendation recommendation={recommendationDataFeed} style={{ margin: 10 }} />
				</Mask>
				<BottomGreyZone></BottomGreyZone>
			</SubContainer>
			{isLoading ? (
				<Navigation>
					<Spinner size={30}></Spinner>
				</Navigation>
			) : (
				<Navigation>
					{step < 1 ? (
						<NavButton
							onPress={() => {
								navigate(Routes.OnboardingPersonalInfo2, {
									firstName,
									lastName,
									country,
								});
							}}
						>
							<NavText>Back</NavText>
						</NavButton>
					) : (
						<NavButton
							onPress={() => {
								completeTutorial();
							}}
						>
							<NavText>Skip</NavText>
						</NavButton>
					)}
					<FourDot step={step} />
					<NavButton
						onPress={() => {
							step < 3 ? setStep((step) => step + 1) : completeTutorial();
						}}
					>
						<NavText>Next</NavText>
					</NavButton>
				</Navigation>
			)}
		</Container>
	);
};

const BottomGreyZone = styled.View`
	background-color: rgba(0, 0, 0, 0.65);
	flex: 1;
`;

const SubContainer = styled.View`
	background-color: white;
	flex: 1;
`;

const Container = styled.View`
	flex: 1;
`;

const Navigation = styled.View`
	position: absolute;
	bottom: 0px;
	z-index: 400;
	height: 93px;
	width: 100%;
	background-color: ${colors.lightgray};
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
`;

const NavButton = styled.TouchableOpacity`
	height: 53px;
	margin: 20px;
`;

const NavText = styled.Text`
	line-height: 53px;
`;
