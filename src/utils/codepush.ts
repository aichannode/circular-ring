import CodePush, { CodePushOptions } from "react-native-code-push";

export const options = (): CodePushOptions => {
	return {
		/*updateDialog: {
			title: "A new update is available",
			optionalIgnoreButtonLabel: "Later",
			optionalInstallButtonLabel: "Update now",
			optionalUpdateMessage: "A new update is available. Do you want to install it ?",
		},*/
		checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
		installMode: CodePush.InstallMode.ON_NEXT_RESTART,
		mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
		minimumBackgroundDuration: 0,
		rollbackRetryOptions: {
			maxRetryAttempts: 1000,
			delayInHours: 1,
		},
		//syncStatusChangeCallback: CodePushManager.syncStatusChange(syncStatus),
		//downloadProgressCallback: CodePushManager.downloadProgress(progress)
	};
};

export const silentOptions = (): { checkFrequency: CodePush.CheckFrequency; installMode: CodePush.InstallMode } => {
	return {
		checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
		installMode: CodePush.InstallMode.ON_NEXT_RESTART,
	};
};
