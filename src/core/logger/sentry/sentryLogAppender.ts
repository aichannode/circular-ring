import { LogAppender, LogEvent, LogLevel } from "@betomorrow/logging-native";
import * as Sentry from "@sentry/react-native";
import { SentryLogFormatter } from "./sentryLogFormatter";

export class SentryLogAppender implements LogAppender {
	private formatter = new SentryLogFormatter();

	async init(): Promise<void> {
		return;
	}

	append(event: LogEvent): void {
		try {
			const message = this.formatter.logToString(event);
			if (event.level < LogLevel.WARN) {
				Sentry.addBreadcrumb({ type: "debug", message, level: this.getLevel(event.level) });
			} else {
				Sentry.captureMessage(message, this.getLevel(event.level));
			}
		} catch {
			return;
		}
	}

	private getLevel(level: LogLevel) {
		switch (level) {
			case LogLevel.TRACE:
				return Sentry.Severity.Log;
			case LogLevel.DEBUG:
				return Sentry.Severity.Debug;
			case LogLevel.INFO:
				return Sentry.Severity.Info;
			case LogLevel.WARN:
				return Sentry.Severity.Warning;
			case LogLevel.ERROR:
				return Sentry.Severity.Error;
		}
	}
}
