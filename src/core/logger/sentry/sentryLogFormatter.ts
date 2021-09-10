import { LogFormatter, LogEvent } from "@betomorrow/logging-native";

export class SentryLogFormatter implements LogFormatter {
	logToString(event: LogEvent): string {
		if (event.args.length > 0) {
			return `${event.sender}: ${this.toMessage(event.args)}`;
		} else {
			return `${event.sender}`;
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
