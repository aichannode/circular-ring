import { useServices } from "@core/services";
import { PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { useObservable } from "micro-observables";
import { PrimaryButton } from "@ui/components/buttons";
import { DFUEmitter } from "react-native-nordic-dfu";
import { ChunkedCircle, CircleGradient } from "@ui/components/shapes/chunkedCircle";
import { SecondaryText } from "@ui/components/text";
import { UpdateState } from "@domain/device/bleDeviceService";
import { useNavigation } from "@react-navigation/core";
import { Image } from "react-native";

interface I_UpdatingComponent {
	showUpdateFailed: () => void;
}

export const UpdatingComponent: React.FC<I_UpdatingComponent> = ({ showUpdateFailed }) => {
	const { format } = useI18n();
	const [uploadPercent, setUploadPercent] = useState<number>(0);
	const [progress, setProgress] = useState(0);
	const { bleDeviceService, ringManagementService } = useServices();
	const updateState = useObservable(bleDeviceService.updateState);
	const { goBack } = useNavigation();

	useEffect(() => {
		console.log("UPDATEING COMPONENT updateState", updateState);
		if (updateState.error) {
			console.log("SHOW BOTTOM SHEET");
			showUpdateFailed();
		}
	}, [updateState]);

	useEffect(() => {
		setProgress(uploadPercent * 0.8);
	}, [uploadPercent]);

	useEffect(() => {
		DFUEmitter.addListener("DFUProgress", ({ percent }) => {
			if (percent) setUploadPercent(percent);
		});

		DFUEmitter.addListener("DFUStateChanged", ({ state }) => {
			console.log("DFU State:", state);
		});
	}, []);

	return (
		<UpdatingContainer>
			{updateState.status === UpdateState.UPDATE_SUCCESS.status ? (
				<>
					<PrimaryText style={{ fontWeight: "bold", fontSize: 25, textAlign: "center", marginTop: 50 }}>
						{format("updateFirmware.updateSuccess")}
					</PrimaryText>
					<CenterView>
						<Image style={{ height: 100, width: 100, borderWidth: 1 }} source={require("@assets/images/check.png")} />
					</CenterView>
					<PrimaryButton
						onPress={() => {
							ringManagementService.submitFirmwareVersion();
							bleDeviceService.updateState.set(UpdateState.IDLE);
							goBack();
						}}
						style={{ position: "absolute", bottom: "0%" }}
					>
						{format("global.done")}
					</PrimaryButton>
				</>
			) : (
				<>
					<Description>{format("updateFirmware.updating.description")}</Description>
					<View style={{ marginTop: 80 }}>
						<ChunkedCircle
							size={140}
							strokeWidth={12}
							gradient={CircleGradient.PURPLE}
							pathRatio={Math.round(progress + updateState.progress) / 100}
						/>
						<CenterView>
							<Bold style={{ fontSize: 35 }}>
								{Math.round(progress + updateState.progress) ?? "?"}
								{"%"}
							</Bold>
						</CenterView>
					</View>
					<SecondaryText style={{ marginTop: 50 }}>{updateState.status}</SecondaryText>
				</>
			)}
		</UpdatingContainer>
	);
};

const Description = styled(PrimaryText)`
	margin-top: 32px;
	font-size: 14px;
	text-align: center;
`;

const UpdatingContainer = styled.View`
	flex: 1;
	align-items: center;
	padding: 0px 50px;
`;

const CenterView = styled.View`
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const Bold = styled.Text`
	font-weight: bold;
`;
