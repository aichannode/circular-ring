import React from "react";
import { SecondaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView, Stack } from "@ui/components/layout";
import { PrimaryText } from "@ui/components/text";
import { Image } from "react-native";

import styled from "styled-components/native";

import { useI18n } from "@ui/i18n";

interface I_SetUpCompleted {
	route: {
		params: {
			ringName: string | null;
			action: () => void;
		};
	};
}

export const SetUpCompleted = ({ route }: I_SetUpCompleted) => {
	const { format } = useI18n();
	return (
		<>
			<ResponsiveCenterView style={{ flex: 1, justifyContent: "space-around", marginTop: 100 }}>
				<Stack align="center">
					<Image source={require("@assets/images/ringShadow.png")} style={{ position: "absolute" }} />
					<Image source={require("@assets/images/ringBig.png")} style={{ marginTop: 40 }} />
					<BoldText style={{ marginTop: 70 }}>{route.params.ringName}</BoldText>
				</Stack>
				<Stack align="center">
					<BoldText>{format("setup.connection.complete.title")}</BoldText>
					<Image source={require("@assets/images/checkBig.png")} style={{ marginTop: 36 }} />
				</Stack>
				<SecondaryButton style={{}} onPress={() => route.params.action()}>
					{format("done")}
				</SecondaryButton>
			</ResponsiveCenterView>
		</>
	);
};

const BoldText = styled(PrimaryText)`
	font-weight: bold;
`;
