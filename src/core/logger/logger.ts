import {
	ConsoleFormatter,
	DebugScreenFormatter,
	DefaultLoggerManagerBuilder,
	DEFAULT_LOG_DIR,
	LogFileReader,
	MemoryStorage,
} from "@betomorrow/logging-native";
import * as RNFS from "react-native-fs";
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

export async function getLastLogFile() {
	try {
		const fileReader = new LogFileReader(DEFAULT_LOG_DIR);
		const file = await fileReader.getLogFiles(1);
		return RNFS.readFile(file[0].path);
	} catch {
		return "Failed to open crash log file";
	}
}
