// import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ResponsiveCenterView } from "@ui/components/layout";
import { CircularBottomSheetHandle, CircularBottomScrollSheet } from "@ui/components/bottomSheet/bottomSheet";
import styled from "styled-components/native";
import WheelPicker2 from "react-native-wheely";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useServices } from "@core/services";

interface TimerBottomSheetProps {
	onClose: () => void;
}

const Countdown = ({ remainingTime }: { remainingTime: number }) => {
	const hours = ("0" + Math.floor(remainingTime / 3600)).slice(-2);
	const minutes = ("0" + Math.floor((remainingTime % 3600) / 60)).slice(-2);
	const seconds = ("0" + (remainingTime % 60)).slice(-2);

	return <Text style={{ fontSize: 35 }}>{`${hours}:${minutes}:${seconds}`}</Text>;
};

const WheelPicker = ({ onClose }: { onClose: () => void }) => {
	const [selectedHour, setSelectedHour] = useState(0);
	const [selectedMinute, setSelectedMinute] = useState(0);
	const [selectedSeconde, setSelectedSeconde] = useState(0);
	const [showCountdown, setShowCountdown] = useState(false);
	const [isPlaying, setPlaying] = useState(true);

	// console.log("Selected Second", selectedSeconde);

	const sixty = useMemo(() => Array.from({ length: 60 }, (_, i) => ("0" + i).slice(-2)), []);
	const secondes = useMemo(() => Array.from({ length: 12 }, (_, i) => ("0" + i * 5).slice(-2)), []);
	const twelve = useMemo(() => Array.from({ length: 12 }, (_, i) => ("0" + i).slice(-2)), []);

	const { timerService } = useServices();

	if (showCountdown) {
		return (
			<View style={{ width: 250, display: "flex", marginTop: 30 }}>
				<CountdownCircleTimer
					isPlaying={isPlaying}
					duration={selectedMinute * 60 + selectedSeconde * 5 + selectedHour * 60 * 60}
					colors={colors.orangeRed}
					size={250}
					strokeWidth={8}
				>
					{({ remainingTime }) => <Countdown remainingTime={remainingTime}></Countdown>}
				</CountdownCircleTimer>
				<View
					style={{ display: "flex", flexDirection: "row", width: 250, justifyContent: "space-evenly", paddingTop: 70 }}
				>
					<SecondaryButton onPress={onClose}>Cancel</SecondaryButton>
					<PrimaryButton
						onPress={() => {
							setPlaying(!isPlaying);
							timerService.stop();
						}}
					>
						{isPlaying ? "Pause" : "Play"}
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
					display: "flex",
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
				style={{ marginTop: 30, width: 90, alignSelf: "center" }}
			>
				Start
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

export const TimerTile = () => {
	const TimerBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const [timer, setTimer] = useState<null | number>(null);

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
			<Tile>
				<TouchableOpacity onPress={() => TimerBottomSheetRef.current?.present()}>
					<Bold>Timer</Bold>
					<Light>{timer ? timer : "off"}</Light>
				</TouchableOpacity>
			</Tile>
			<CircularBottomScrollSheet snapPoints={[480]} ref={TimerBottomSheetRef} allowSwipeDownToClose={false}>
				<TimerBottomSheet onClose={() => TimerBottomSheetRef.current?.close()} />
			</CircularBottomScrollSheet>
		</>
	);
};

const Tile = styled.View`
	flex: 1;
	height: 50px;
	justify-content: center;
`;

const SheetContainer = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
	padding-top: 30px;
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
