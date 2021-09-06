import { useEffect } from "react";
import * as Sentry from "@sentry/react-native";
import Config from "react-native-config";

export function useSentry() {
	useEffect(() => {
		if (!__DEV__ && Config.SENTRY_APPENDER_ENABLED) {
			Sentry.init({
				dsn: Config.SENTRY_DSN,
				enableAutoSessionTracking: true,
			});
		}
	}, []);
}
