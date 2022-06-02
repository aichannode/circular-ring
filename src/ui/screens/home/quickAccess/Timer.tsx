// import { useI18n } from "@ui/i18n";
import { useServices } from "@core/services";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { colors } from "@ui/styles/colors";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import WheelPicker2 from "react-native-wheely";
import styled from "styled-components/native";
import { Tile } from "../components/Tile";
import { useI18n } from "@ui/i18n";

interface TimerBottomSheetProps {
	onClose: () => void;
}

const WheelPicker = ({ onClose }: { onClose: () => void }) => {
	const [selectedHour, setSelectedHour] = useState(0);
	const [selectedMinute, setSelectedMinute] = useState(0);
	const [selectedSeconde, setSelectedSeconde] = useState(0);
	const [showCountdown, setShowCountdown] = useState(false);
	const [isPlaying, setPlaying] = useState(true);

	const sixty = useMemo(() => Array.from({ length: 60 }, (_, i) => ("0" + i).slice(-2)), []);
	const secondes = useMemo(() => Array.from({ length: 12 }, (_, i) => ("0" + i * 5).slice(-2)), []);
	const twelve = useMemo(() => Array.from({ length: 12 }, (_, i) => ("0" + i).slice(-2)), []);

	const { timerService } = useServices();
	const { format } = useI18n();

	if (showCountdown || timerService.timer.get().remainingSecondes) {
		return (
			<View style={{ width: 250, display: "flex", marginTop: 30 }}>
				<CountdownCircleTimer
					isPlaying={isPlaying}
					duration={timerService.timer.get().initialRemainingTime}
					initialRemainingTime={timerService.timer.get().remainingSecondes}
					colors={colors.redOrange}
					size={250}
					strokeWidth={8}
				>
					{() => <Text style={{ fontSize: 35 }}>{countdown(timerService.timer.get().remainingSecondes)}</Text>}
				</CountdownCircleTimer>
				<View
					style={{ display: "flex", flexDirection: "row", width: 250, justifyContent: "space-evenly", paddingTop: 40 }}
				>
					<SecondaryButton
						onPress={() => {
							setShowCountdown(false);
							timerService.stop();
						}}
					>
						{format("global.cancel")}
					</SecondaryButton>
					<PrimaryButton
						onPress={() => {
							setPlaying(!isPlaying);
							if (isPlaying) timerService.pause();
							else timerService.play(timerService.timer.get().remainingSecondes);
						}}
					>
						{format(isPlaying ? "quickaccess.timer.pause" : "quickaccess.timer.play")}
					</PrimaryButton>
				</View>
			</View>
		);
	}

	return (
		<View style={{ display: "flex", flex: 1, width: "100%" }}>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					width: "100%",
					justifyContent: "space-evenly",
					zIndex: 100,
				}}
			>
				<WheelPicker2
					selectedIndex={selectedHour}
					options={twelve}
					onChange={(index) => setSelectedHour(index)}
					itemHeight={50}
					itemTextStyle={{ lineHeight: 50, fontSize: 30 }}
					selectedIndicatorStyle={{ backgroundColor: "white" }}
				/>
				<Text style={{ lineHeight: 240, fontSize: 45 }}>:</Text>
				<WheelPicker2
					selectedIndex={selectedMinute}
					options={sixty}
					onChange={(index) => setSelectedMinute(index)}
					itemHeight={50}
					itemTextStyle={{ lineHeight: 50, fontSize: 30 }}
					selectedIndicatorStyle={{ backgroundColor: "white" }}
				/>
				<Text style={{ lineHeight: 240, fontSize: 45 }}>:</Text>
				<WheelPicker2
					selectedIndex={selectedSeconde}
					options={secondes}
					onChange={(index) => setSelectedSeconde(index)}
					itemHeight={50}
					itemTextStyle={{ lineHeight: 50, fontSize: 30 }}
					selectedIndicatorStyle={{ backgroundColor: "white" }}
				/>
			</View>
			<View
				style={{
					flexDirection: "row",
					width: "100%",
					justifyContent: "space-between",
					marginTop: 30,
				}}
			>
				<PickerLabel>hr</PickerLabel>
				<PickerLabel>min</PickerLabel>
				<PickerLabel>sec</PickerLabel>
			</View>
			<PrimaryButton
				onPress={() => {
					setShowCountdown(true);
					timerService.play(selectedMinute * 60 + selectedSeconde * 5 + selectedHour * 60 * 60);
				}}
				style={{ marginTop: 55, width: 90, alignSelf: "center" }}
			>
				{format("quickaccess.timer.start")}
			</PrimaryButton>
		</View>
	);
};

const PickerLabel = styled.Text`
	text-align: center;
	color: ${colors.gray};
	width: 80px;
`;

const TimerBottomSheet: React.FC<TimerBottomSheetProps> = ({ onClose }) => {
	return (
		<SheetContainer>
			<WheelPicker onClose={onClose}></WheelPicker>
		</SheetContainer>
	);
};

const countdown = (remainingTime: number) => {
	const hours = ("0" + Math.floor(remainingTime / 3600)).slice(-2);
	const minutes = ("0" + Math.floor((remainingTime % 3600) / 60)).slice(-2);
	const seconds = ("0" + (remainingTime % 60)).slice(-2);

	return `${hours}:${minutes}:${seconds}`;
};

export const TimerTile = () => {
	const TimerBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const [timer, setTimer] = useState<null | number>(null);
	const { format } = useI18n();

	const { timerService } = useServices();
	useEffect(() => {
		const timer = timerService.timer.get();
		if (timer !== null) setTimer(timer.remainingSecondes);
	}, []);

	timerService.timer.subscribe((timer) => {
		setTimer(timer.remainingSecondes);
	});

	return (
		<>
			<Tile onPress={() => TimerBottomSheetRef.current?.present()}>
				<Bold>{format("quickaccess.timertitle")}</Bold>
				<Light>{timer ? countdown(timer) : format("global.off")}</Light>
			</Tile>
			<CircularBottomSheet snapPoints={[480]} ref={TimerBottomSheetRef} allowSwipeDownToClose={false}>
				<TimerBottomSheet onClose={() => TimerBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</>
	);
};

const SheetContainer = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const Bold = styled.Text`
	text-align: center;
	font-size: 14px;
`;

const Light = styled.Text`
	color: ${colors.gray};
	text-align: center;
	font-size: 12px;
`;
