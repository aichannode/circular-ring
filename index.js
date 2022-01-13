import { configure } from "mobx";
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import { App } from "./src/app";

console.disableYellowBox = true;

configure({ useProxies: "never" });

AppRegistry.registerComponent(appName, () => App);
