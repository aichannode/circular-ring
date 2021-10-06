import { LogEvent, LogFormatter, LogLevel } from "@betomorrow/logging-native";

export class LoggerFileFormatter implements LogFormatter {
	logToString(event: LogEvent): string {
		if (event.args.length > 0) {
			return `${event.date.toISOString()} [${LogLevel[event.level]}] ${event.sender}: ${this.toMessage(event.args)}`;
		} else {
			return `${event.date.toISOString()} [${LogLevel[event.level]}] ${event.sender}`;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private toMessage(args: any[]): string {
		return args.reduce((prev, v) => {
			const prevOutput = JSON.stringify(prev);
			if (!v) {
				return prevOutput;
			}
			const vOutput = JSON.stringify(v);
			return prevOutput ? `${prevOutput}, ${vOutput}` : vOutput;
		});
	}
}
