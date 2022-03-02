import { DrawerActions } from "@react-navigation/native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { Grow } from "@ui/components/layout";
import { BackButton } from "@ui/components/navigation/backButton";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const Header = ({ options, navigation }: NativeStackHeaderProps) => {
	const { top } = useSafeAreaInsets();

	const hasCircleIcon = !!options.headerLeft;

	return (
		<Container statusBarHeight={top}>
			{hasCircleIcon ? (
				<>
					{navigation.canGoBack() ? (
						<BackButton imageSource={options.headerBackImageSource} />
					) : (
						<Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer)}>
							<Image source={require("@assets/images/menu.png")} style={{ marginLeft: 10 }} />
						</Pressable>
					)}
					<Spacer size={8} />
					{options.headerLeft ? options.headerLeft({ canGoBack: true }) : null}
					<Spacer size={16} />
					{options.title ? <Title>{options.title}</Title> : <Image source={require("@assets/images/logoHeader.png")} />}
					<Grow />
					{/* If there is a bug try with "canGoBack: true" */}
					{options.headerRight ? options.headerRight({ canGoBack: false }) : null}
				</>
			) : (
				<>
					<Left alignLeft={hasCircleIcon}>
						{navigation.canGoBack() ? (
							<BackButton imageSource={options.headerBackImageSource} />
						) : (
							<Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer)}>
								<Image source={require("@assets/images/menu.png")} style={{ marginLeft: 10 }} />
							</Pressable>
						)}
					</Left>
					<Center>
						{options.title ? (
							<Title>{options.title}</Title>
						) : (
							<Image source={require("@assets/images/logoHeader.png")} />
						)}
					</Center>
					{/* If there is a bug try with "canGoBack: true" */}
					<Right alignLeft={hasCircleIcon}>
						{options.headerRight ? options.headerRight({ canGoBack: false }) : null}
					</Right>
				</>
			)}
		</Container>
	);
};

const Container = styled.View<{ statusBarHeight: number }>`
	height: ${({ statusBarHeight }) => statusBarHeight + 75}px;
	background-color: ${colors.lightgray};
	flex-direction: row;
	padding: ${({ statusBarHeight }) => statusBarHeight}px 16px 0;
	align-items: center;
`;

const Left = styled.View<{ alignLeft: boolean }>`
	flex: ${({ alignLeft }) => (alignLeft ? 0 : 1)};
	padding-right: 10px;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`;

const Spacer = styled.View<{ size: number }>`
	width: ${({ size }) => size}px;
`;

const Center = styled.View`
	flex-shrink: 0;
`;

const Title = styled.Text`
	font-size: 18px;
	font-weight: 500;
	color: ${colors.textPrimary};
`;

const Right = styled.View<{ alignLeft: boolean }>`
	flex: ${({ alignLeft }) => (alignLeft ? 0 : 1)};
	padding-left: 10px;
	flex-direction: row;
	justify-content: flex-end;
`;
