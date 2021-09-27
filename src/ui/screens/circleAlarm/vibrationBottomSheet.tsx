import { useServices } from "@core/services";
import { Melody, melodyOrderedList } from "@domain/ring/ringAlarm";
import Slider from "@react-native-community/slider";
import { QuadraryButton } from "@ui/components/buttons";
import { SelectionList } from "@ui/components/selectionList";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState } from "react";
import styled from "styled-components/native";

interface VibrationBottomSheetProps {
	vibrationPower: number;
	melody: Melody;
	onClose: (vibrationPower: number, Melody: Melody) => void;
}
export const VibrationBottomSheet: React.FC<VibrationBottomSheetProps> = ({ vibrationPower, melody, onClose }) => {
	const { format } = useI18n();
	const [vibration, setVibration] = useState(vibrationPower);
	const [newMelody, setNewMelody] = useState(melody);
	const { circleAlarmService } = useServices();

	return (
		<Container>
			<Title>{format("alarm.new.edit_vibration.title")}</Title>
			<SubTitle>{format("alarm.new.edit_vibration.intensity")}</SubTitle>
			<Slider
				style={{ width: 200, height: 40, alignSelf: "center" }}
				value={vibration}
				onValueChange={(value) => setVibration(Math.floor(value))}
				minimumValue={0}
				maximumValue={100}
				minimumTrackTintColor={colors.blue}
				thumbTintColor={colors.blue}
				maximumTrackTintColor={colors.gray}
			/>
			<SubTitle>{format("alarm.new.edit_vibration.type.title")}</SubTitle>
			<SelectionList
				list={melodyOrderedList.slice(4)}
				defaultIndex={melodyOrderedList.slice(4).indexOf(melody)}
				triggeredData={(data) => {
					setNewMelody(data as Melody);
					circleAlarmService.playMelody(data as Melody, vibration);
				}}
			/>
			<QuadraryButton style={{ alignSelf: "center" }} onPress={() => onClose(vibration, newMelody)}>
				{format("alarm.new.save_button")}
			</QuadraryButton>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	padding-vertical: 20px;
`;

const Title = styled(TitleText)`
	align-self: center;
`;

const SubTitle = styled(TitleText)`
	margin-left: 34px;
	margin-vertical: 40px;
`;
