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

const start = 51;
const stop = 191;

export const HighHrScreen: React.FC = () => {
	const { format } = useI18n();
	const { goBack } = useRoutesNavigation();
	const { userService } = useServices();
	const notificationsSettings = useNotificationsSettings();
	const [value, setValue] = useState<number | number[]>(notificationsSettings.highHR);
	const advancedInfo = useUserAdvancedInfo();

	return (
		<Container>
			<InfoListItem
				name={format("highHr.highHRalert")}
				switchOptions={[format("global.onShift"), format("global.offShift")]}
				switchValue={notificationsSettings.highHRAlert}
				onSwitchSelect={(val) => userService.updateUserNotificationsSettings({ highHRAlert: val })}
				lightTheme
			/>
			<FlexView>
				<Description>{format("highHr.description")}</Description>
				<SliderBetweenTwoValues
					title={format("highHr.bpm")}
					start={start}
					stop={stop}
					value={value}
					defaultValue={advancedInfo?.maxHr ?? stop}
					setValue={setValue}
				></SliderBetweenTwoValues>
				<ButtonContainer>
					<SecondaryButton
						onPress={() => {
							userService.updateUserNotificationsSettings({ highHR: value });
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
