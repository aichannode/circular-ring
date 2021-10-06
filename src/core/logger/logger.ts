import {
	ConsoleFormatter,
	DebugScreenFormatter,
	DefaultLoggerManagerBuilder,
	DEFAULT_LOG_DIR,
	LogFileReader,
	MemoryStorage,
} from "@betomorrow/logging-native";
import { Alert } from "react-native";
import DeviceInfo from "react-native-device-info";
import * as RNFS from "react-native-fs";
import Mailer, { Attachment } from "react-native-mail";
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

export async function sendLogEmail() {
	const logger = getLogger("sendLogEmail");
	try {
		const fileReader = new LogFileReader(DEFAULT_LOG_DIR);
		const files = await fileReader.getLogFiles(5);

		const attachments: Attachment[] = files.map((f) => ({ path: f.path, type: "text", name: f.name }));
		const body = `<br />
		App name: ${DeviceInfo.getApplicationName()}<br />
		App version: ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})<br />
		Device: ${DeviceInfo.getBrand()} ${DeviceInfo.getDeviceId()}<br />
		OS version: ${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`;
		Mailer.mail(
			{
				subject: "[Circular] Mobile app logs",
				recipients: ["circular@betomorrow.com"],
				isHTML: true,
				body: body,
				attachments: attachments,
			},
			(error) => {
				if (error === "not_available") {
					Alert.alert("Can't send email", "Functionnality may not be available on device", [
						{
							text: "Ok",
							style: "cancel",
						},
					]);
				} else if (error) {
					logger.error(error);
				}
			},
		);
	} catch (error) {
		logger.error(error);
	}
}
