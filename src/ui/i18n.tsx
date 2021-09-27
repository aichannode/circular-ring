import { ScoreQuality } from "@domain/circleActivity/circleActivityData";
import { Weekdays } from "@domain/ring/ringAlarm";
import { alarmDataEOF } from "@domain/ring/ringData";
import { Intensity } from "@domain/ring/ringLiveData";
import React, { useCallback } from "react";
import { FormatDateOptions, useIntl } from "react-intl";
import { WordingKey } from "../wordings";
import { Colored, Strong } from "./components/text";

const xmlFormatters = {
	strong: (...chunks: string[]) => <Strong>{chunks}</Strong>,
	colored: (...chunks: string[]) => <Colored>{chunks}</Colored>,
} as const;

export function useI18n() {
	const intl = useIntl();

	return {
		...intl,
		format: useCallback(
			(key: WordingKey, values?: Record<string, string | number | boolean | Date | null | undefined> | undefined) => {
				return intl.formatMessage({ id: key }, { ...values, ...xmlFormatters }) as string;
			},
			[intl]
		),
		formatDateTime: (
			value?: string | number | Date,
			format: FormatDateOptions = {
				day: "numeric",
				month: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
			}
		) => intl.formatDate(value, format),

		formatDuration: (second: number) => {
			const hourCount = Math.floor(second / 3600);
			const minuteCount = Math.floor(second / 60) % 60;
			if (hourCount > 0 && minuteCount > 0) {
				return `${hourCount}h${minuteCount.toString().padStart(2, "0")}`;
			} else if (hourCount > 0) {
				return `${hourCount}h`;
			} else {
				return `${minuteCount} min`;
			}
		},
		formatScoreQuality: (scoreQuality: ScoreQuality) => {
			switch (scoreQuality) {
				case ScoreQuality.POOR:
					return intl.formatMessage({ id: "score.quality.poor" });
				case ScoreQuality.GOOD:
					return intl.formatMessage({ id: "score.quality.good" });
				case ScoreQuality.OPTIMAL:
					return intl.formatMessage({ id: "score.quality.optimal" });
			}
		},
		formatIntensity: (intensity: Intensity) => {
			switch (intensity) {
				case Intensity.LOW:
					return intl.formatMessage({ id: "intensity.low" });
				case Intensity.MEDIUM:
					return intl.formatMessage({ id: "intensity.medium" });
				case Intensity.HIGH:
					return intl.formatMessage({ id: "intensity.high" });
				case Intensity.NONE:
					return intl.formatMessage({ id: "intensity.none" });
			}
		},
		formatDay: (days: Weekdays[]) => {
			const weekdays = [Weekdays.MONDAY, Weekdays.TUESDAY, Weekdays.WEDNESDAY, Weekdays.THURSDAY, Weekdays.FRIDAY];
			const everydays = [
				Weekdays.MONDAY,
				Weekdays.TUESDAY,
				Weekdays.WEDNESDAY,
				Weekdays.THURSDAY,
				Weekdays.FRIDAY,
				Weekdays.SATURDAY,
				Weekdays.SUNDAY,
			];
			if (everydays.every((day) => days.includes(day))) {
				return intl.formatMessage({ id: "alarm.everydays" });
			} else if (weekdays.every((day) => days.includes(day))) {
				return intl.formatMessage({ id: "alarm.weekdays" });
			} else {
				return days
					.map((day) => {
						switch (day) {
							case Weekdays.MONDAY:
								return intl.formatMessage({ id: "alarm.new.repeat.monday" }).substring(0, 3);

							case Weekdays.TUESDAY:
								return intl.formatMessage({ id: "alarm.new.repeat.tuesday" }).substring(0, 3);

							case Weekdays.WEDNESDAY:
								return intl.formatMessage({ id: "alarm.new.repeat.wednesday" }).substring(0, 3);

							case Weekdays.THURSDAY:
								return intl.formatMessage({ id: "alarm.new.repeat.thursday" }).substring(0, 3);

							case Weekdays.FRIDAY:
								return intl.formatMessage({ id: "alarm.new.repeat.friday" }).substring(0, 3);

							case Weekdays.SATURDAY:
								return intl.formatMessage({ id: "alarm.new.repeat.saturday" }).substring(0, 3);

							case Weekdays.SUNDAY:
								return intl.formatMessage({ id: "alarm.new.repeat.sunday" }).substring(0, 3);
						}
					})
					.join(", ");
			}
		},
		formatSnooze: (snooze: number) => {
			switch (snooze) {
				case 1:
					return "1 " + intl.formatMessage({ id: "alarm.new.snooze.minute" });
				case 2:
					return "2 " + intl.formatMessage({ id: "alarm.new.snooze.minutes" });
				case 3:
					return "5 " + intl.formatMessage({ id: "alarm.new.snooze.minutes" });
				case 4:
					return "10 " + intl.formatMessage({ id: "alarm.new.snooze.minutes" });
				case 5:
					return "15 " + intl.formatMessage({ id: "alarm.new.snooze.minutes" });
				case 0:
					return intl.formatMessage({ id: "alarm.new.snooze.off" });
			}
		},
		formatSmart: (smart: number) => {
			switch (smart) {
				case 1:
					return "30 " + intl.formatMessage({ id: "alarm.new.snooze.minutes" });
				case 2:
					return "45 " + intl.formatMessage({ id: "alarm.new.snooze.minutes" });
				case 3:
					return "1 " + intl.formatMessage({ id: "alarm.new.snooze.hour" });
				case 4:
					return "1:15 " + intl.formatMessage({ id: "alarm.new.snooze.hours" });
				case 5:
					return "1:30 " + intl.formatMessage({ id: "alarm.new.snooze.minutes" });
				case 0:
					return intl.formatMessage({ id: "alarm.new.snooze.off" });
			}
		},
	};
}
