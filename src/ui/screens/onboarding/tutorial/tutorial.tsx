import styled from "styled-components/native";
import React, { useState, useCallback } from "react";
import { Image } from "react-native";
import { colors } from "@ui/styles/colors";
import { useServices } from "@core/services";
import dayjs from "dayjs";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { Spinner } from "@ui/components/spinner";

const FourDot = ({ step }: { step: number }) => {
	const dots = [];

	for (let i = 0; i < 4; i++) {
		if (i < step + 1) dots.push(<DotFilled key={i}></DotFilled>);
		else dots.push(<Dot key={i}></Dot>);
	}

	return <DotContainer>{dots}</DotContainer>;
};

const DotContainer = styled.View`
	height: 53px;
	margin: 20px;
	display: flex;
	flex-direction: row;
`;

const Dot = styled.View`
	height: 10px;
	width: 10px;
	border-radius: 5px;
	background-color: ${colors.gray};
	margin: 21px 2.5px;
`;

const DotFilled = styled.View`
	height: 10px;
	width: 10px;
	border-radius: 5px;
	background-color: ${colors.primary};
	margin: 21px 2.5px;
`;

export const Tutorial = () => {
	const route = useAppRoute<Routes.OnboardingTutorial>();
	const { firstName, lastName, country, birthDate, sex, weight, height, heightUnit, weightUnit } = route.params;
	const { userService } = useServices();
	const [step, setStep] = useState<number>(0);
	const { navigate } = useRoutesNavigation();
	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const { format } = useI18n();

	console.log("ROUTE PARAM TUTO", route.params);

	const image = [
		{ source: require("@assets/images/tutorial1.png") },
		{ source: require("@assets/images/tutorial2.png") },
		{ source: require("@assets/images/tutorial3.png") },
		{ source: require("@assets/images/tutorial4.png") },
	];

	// const fake = () => {
	// 	setLoading(true);
	// 	setTimeout(() => {
	// 		setLoading(false);
	// 	}, 3000);
	// };

	const completeTutorial = useCallback(async () => {
		setLoading(true);
		const _birthDate = dayjs(birthDate, "DD/MM/YYYY", true).toDate();
		try {
			await userService.completeTutorial({ firstName, lastName, country, birthDate: _birthDate, sex, weight, height });
			await userService.updateUserSettings("DD/MM/YYYY", heightUnit, weightUnit);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("onboarding.personal_info.error.default"));
		}
		console.log("TUTORIA UPDATE USER ERROR", errorMessage);
	}, [birthDate, sex, weight, height]);

	return (
		<Container>
			<ImageContainer>
				<Image
					style={{ width: "100%", height: "100%", position: "absolute", top: 0 }}
					resizeMode="cover"
					source={image[step].source}
				></Image>
			</ImageContainer>
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

const Container = styled.View`
	flex: 1;
	background-color: grey;
`;

const ImageContainer = styled.View`
	background-color: ${colors.white};
	width: 100%;
	flex: 1;
	margin-bottom: 93px;
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
