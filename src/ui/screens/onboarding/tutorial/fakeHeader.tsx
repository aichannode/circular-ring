import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";
import { MyRingBattery } from "./fakeRing";

export const FakeHeader = () => {
	const { top } = useSafeAreaInsets();

	// const hasCircleIcon = !!options.headerLeft;

	return (
		<Container statusBarHeight={top}>
			<>
				<Left alignLeft={true}>
					<Pressable onPress={() => null}>
						<Image source={require("@assets/images/menu.png")} style={{ marginLeft: 10 }} />
					</Pressable>
				</Left>
				<Center>
					<Image style={{ marginLeft: "50%" }} source={require("@assets/images/logoHeader.png")} />
				</Center>
				<RingName>My ring</RingName>
				<Right alignLeft={true}>
					<MyRingBattery full />
				</Right>
			</>
		</Container>
	);
};

const RingName = styled.Text`
	margin-right: 10px;
	color: ${colors.textPrimary};
	font-weight: bold;
	font-size: 14px;
`;

const Container = styled.View<{ statusBarHeight: number }>`
	height: ${({ statusBarHeight }) => statusBarHeight + 75}px;
	flex-direction: row;
	padding: ${({ statusBarHeight }) => statusBarHeight}px 16px 0;
	align-items: center;
	background-color: white;
`;

const Left = styled.View<{ alignLeft: boolean }>`
	flex: ${({ alignLeft }) => (alignLeft ? 0 : 1)};
	padding-right: 10px;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`;

const Center = styled.View`
	flex-shrink: 0;
	flex: 1;
	justify-content: center;
	align-self: center;
	margin: auto;
`;

const Right = styled.View<{ alignLeft: boolean }>`
	flex: ${({ alignLeft }) => (alignLeft ? 0 : 1)};
	padding-left: 10px;
	margin-right: 20px;
	flex-direction: row;
	justify-content: flex-end;
`;
