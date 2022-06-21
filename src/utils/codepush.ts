import CodePush from "react-native-code-push";

export const options = (): {
	updateDialog: {
		optionalIgnoreButtonLabel: string;
		optionalInstallButtonLabel: string;
		title: string;
		optionalUpdateMessage: string;
	};
	installMode: CodePush.InstallMode;
	checkFrequency: CodePush.CheckFrequency;
	mandatoryInstallMode: CodePush.InstallMode;
} => {
	return {
		updateDialog: {
			title: "A new update is available",
			optionalIgnoreButtonLabel: "Later",
			optionalInstallButtonLabel: "Update now",
			optionalUpdateMessage: "A new update is available. Do you want to install it ?",
		},
		checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
		installMode: CodePush.InstallMode.ON_NEXT_RESUME,
		mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
		//syncStatusChangeCallback: CodePushManager.syncStatusChange(syncStatus),
		//downloadProgressCallback: CodePushManager.downloadProgress(progress)
	};
};

export const silentOptions = (): { checkFrequency: CodePush.CheckFrequency; installMode: CodePush.InstallMode } => {
	return {
		checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
		installMode: CodePush.InstallMode.ON_NEXT_RESUME,
	};
};
