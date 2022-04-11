import {
	ConsoleFormatter,
	DebugScreenFormatter,
	DefaultLoggerManagerBuilder,
	DEFAULT_LOG_DIR,
	MemoryStorage,
} from "@betomorrow/logging-native";
import { getLoggerConfig } from "./logger.config";
import { LoggerFileFormatter } from "./loggerFileFormatter";
import { SentryLogAppender } from "./sentry/sentryLogAppender";

const loggerConfig = getLoggerConfig();
const loggerBuilder = new DefaultLoggerManagerBuilder()
	.withLevel(loggerConfig.minLogLevel)
	.withMemoryAppender(new MemoryStorage(), new DebugScreenFormatter())
	.withRollingFileAppender(10, DEFAULT_LOG_DIR, new LoggerFileFormatter());

if (loggerConfig.consoleAppenderEnabled) {
	loggerBuilder.withConsoleAppender(new ConsoleFormatter());
}

if (loggerConfig.sentryAppenderEnabled) {
	loggerBuilder.withAppender(new SentryLogAppender());
}

const loggerManager = loggerBuilder.build();

export function getLogger(sender: string) {
	return loggerManager.getLogger(sender);
}
