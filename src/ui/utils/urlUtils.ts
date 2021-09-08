import { Linking } from "react-native";

export const openURL = async (url: string) => {
	const canOpenUrl = await Linking.canOpenURL(url);
	if (canOpenUrl) {
		await Linking.openURL(url);
	} else {
		console.log(`Can't open URL: ${url}`);
	}
};
