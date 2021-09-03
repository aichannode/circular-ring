import { LogLevel } from "@betomorrow/logging-core";
import Config from "react-native-config";

export function getLoggerConfig() {
	return {
		minLogLevel: getConfigMinLogLevel(),
		consoleAppenderEnabled: Config.CONSOLE_APPENDER_ENABLED,
		sentryAppenderEnabled: Config.SENTRY_APPENDER_ENABLED,
	};
}

function getConfigMinLogLevel() {
	switch (Config.MIN_LOG_LEVEL) {
		case "trace":
			return LogLevel.TRACE;
		case "debug":
			return LogLevel.DEBUG;
		case "info":
			return LogLevel.INFO;
		case "warn":
			return LogLevel.WARN;
		case "error":
		default:
			return LogLevel.ERROR;
	}
}
