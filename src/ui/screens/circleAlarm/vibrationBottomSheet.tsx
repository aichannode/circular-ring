import { useServices } from "@core/services";
import { Melody, melodyOrderedList } from "@domain/ring/ringAlarm";
import Slider from "@react-native-community/slider";
import { QuadraryButton } from "@ui/components/buttons";
import { InfoListHeader } from "@ui/components/infoList";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState } from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components/native";

interface VibrationBottomSheetProps {
	vibrationPower: number;
	melody: Melody;
	onClose: (vibrationPower: number, Melody: Melody) => void;
}
export const VibrationBottomSheet: React.FC<VibrationBottomSheetProps> = ({ vibrationPower, melody, onClose }) => {
	const { format, formatMelody } = useI18n();
	const [vibration, setVibration] = useState(vibrationPower);
	const [selectedMelody, setSelectedMelody] = useState(melody);
	const { circleAlarmService } = useServices();

	const melodies = melodyOrderedList.slice(4);

	return (
		<Container>
			<Title>{format("alarm.new.edit_vibration.title")}</Title>
			<InfoListHeader style={{ marginLeft: 10 }}>{format("alarm.new.edit_vibration.intensity")}</InfoListHeader>
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
			<InfoListHeader style={{ marginLeft: 10 }}>{format("alarm.new.edit_vibration.type.title")}</InfoListHeader>
			<StyledScrollView>
				{melodies.map((melody, index) => {
					const selected = selectedMelody === melody;
					return (
						<Selector
							key={melody.toString()}
							onPress={() => {
								setSelectedMelody(melody);
								circleAlarmService.playMelody(melody, vibration);
							}}
							isLast={index === melodies.length - 1}
						>
							<Text>{formatMelody(melody)}</Text>
							<Check selected={selected}>
								{selected && <CheckIcon source={require("@assets/images/checkSmall.png")} tintColor={colors.white} />}
							</Check>
						</Selector>
					);
				})}
			</StyledScrollView>
			<QuadraryButton style={{ alignSelf: "center", marginTop: 30 }} onPress={() => onClose(vibration, selectedMelody)}>
				{format("alarm.new.save_button")}
			</QuadraryButton>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	padding: 20px 24px;
`;

const Title = styled(TitleText)`
	align-self: center;
`;

const StyledScrollView = styled(ScrollView)`
	width: 100%;
	flex-grow: 0;
`;

const Selector = styled.Pressable<{ isLast: boolean }>`
	height: 50px;
	flex-direction: row;
	padding: 0 24px;
	justify-content: space-between;
	align-items: center;
	border-bottom-width: ${({ isLast }) => (isLast ? 0 : 1)}px;
	border-bottom-color: ${colors.lightgray};
`;

const Check = styled.View<{ selected: boolean }>`
	width: 24px;
	height: 24px;
	justify-content: center;
	align-items: center;
	background-color: ${({ selected }) => (selected ? colors.blue : "transparent")};
	border-radius: 12px;
	border-width: ${({ selected }) => (selected ? 0 : 1)}px;
	border-color: ${colors.lightgray};
`;

const CheckIcon = styled.Image<{ tintColor: string }>`
	height: 14px;
	flex-shrink: 1;
	tint-color: ${(props) => props.tintColor};
	resize-mode: contain;
`;
