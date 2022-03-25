import { useServices } from "@core/services";
import { useNotificationsSettings, useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { SecondaryButton } from "@ui/components/buttons";
import { InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { SliderBetweenTwoValues } from "@ui/components/sliderBetweenTwoValues";
import { useI18n } from "@ui/i18n";
import { useRoutesNavigation } from "@ui/navigation/routes";
import React, { useState } from "react";
import styled from "styled-components/native";

const start = 20;
const stop = 50;

export const LowHrScreen: React.FC = () => {
	const { format } = useI18n();
	const { goBack } = useRoutesNavigation();
	const { userService } = useServices();
	const notificationsSettings = useNotificationsSettings();
	const [value, setValue] = useState<number | number[]>(notificationsSettings.lowHR);
	const advancedInfo = useUserAdvancedInfo();
	const defaultValue = !advancedInfo || !advancedInfo?.comparativeRhr ? 35 : advancedInfo?.comparativeRhr - 10;

	return (
		<Container>
			<InfoListItem
				name={format("lowHr.lowHRalert")}
				switchOptions={["On", "Off"]}
				switchValue={notificationsSettings.lowHRAlert}
				onSwitchSelect={(val) => userService.updateUserNotificationsSettings({ lowHRAlert: val })}
				lightTheme
			/>
			<FlexView>
				<Description>{format("lowHr.description")}</Description>
				<SliderBetweenTwoValues
					title={format("highHr.bpm")}
					start={start}
					stop={stop}
					value={value}
					defaultValue={defaultValue}
					setValue={setValue}
				></SliderBetweenTwoValues>
				<ButtonContainer>
					<SecondaryButton
						onPress={() => {
							userService.updateUserNotificationsSettings({ lowHR: value });
							goBack();
						}}
					>
						{format("done")}
					</SecondaryButton>
				</ButtonContainer>
			</FlexView>
		</Container>
	);
};

const ButtonContainer = styled.View`
	align-items: center;
	align-self: center;
`;

const Container = styled(ScrollScreen)``;

const Description = styled.Text`
	text-align: center;
	width: 70%;
	margin-horizontal: 15%;
`;

const FlexView = styled.View`
	flex: 1;
	display: flex;
	justify-content: space-evenly;
`;
