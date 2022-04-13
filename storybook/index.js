import React from "react";
import { Platform } from "react-native";
import SplashScreen from "react-native-splash-screen";

// This is a workaround to dynamically import the storybook UI dependencies based on the platform.
let InternalStorybookUIRoot = () => null;
const StorybookUIRoot = () => <InternalStorybookUIRoot />;

// CIR-806: Storybook UI is not working on ios in release mode. This is a workaround to make it work.
if (Platform.OS !== "ios" || __DEV__) {
	import("@storybook/react-native").then(({ getStorybookUI, addDecorator, configure }) =>
		import("@storybook/addon-knobs").then(({ withKnobs }) =>
			import("@react-native-async-storage/async-storage").then((asyncStorage) =>
				import("./storyLoader").then(({ loadStories }) =>
					import("./rn-addons").then(() => {
						if (__DEV__) {
							SplashScreen.hide();
						}

						// enables knobs for all stories
						addDecorator(withKnobs);

						// import stories
						configure(() => {
							loadStories();
						}, module);

						// Refer to https://github.com/storybookjs/react-native/tree/master/app/react-native#getstorybookui-options
						// To find allowed options for getStorybookUI
						InternalStorybookUIRoot = getStorybookUI({
							asyncStorage,
						});
					})
				)
			)
		)
	);
}

export default StorybookUIRoot;
