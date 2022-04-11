import { getStorybookUI, configure, addDecorator } from "@storybook/react-native";
import { withKnobs } from "@storybook/addon-knobs";

import asyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "react-native-splash-screen";

import { loadStories } from "./storyLoader";

import "./rn-addons";

SplashScreen.hide();

// enables knobs for all stories
addDecorator(withKnobs);

// import stories
configure(() => {
	loadStories();
}, module);

// Refer to https://github.com/storybookjs/react-native/tree/master/app/react-native#getstorybookui-options
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
	asyncStorage,
});

export default StorybookUIRoot;
