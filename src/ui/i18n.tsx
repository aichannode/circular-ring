import { ScoreQuality } from "@domain/measure/representation/api";
import { SignalQuality } from "@domain/measure/score";
import { Melody, Weekdays } from "@domain/ring/ringAlarm";
import { Intensity } from "@domain/ring/ringLiveData";
import { useIsUSCS } from "@domain/user/hooks/useUser";
import dayjs from "dayjs";
import React, { useCallback } from "react";
import { FormatDateOptions, useIntl } from "react-intl";
import { ColorValue } from "react-native";
import { WordingKey } from "../wordings";
import { Bold, Colored, Strong } from "./components/text";

export type FormatterOptions = Partial<{
	color: ColorValue;
}>;

function createXmlFormatters(options?: FormatterOptions) {
	return {
		strong: (...chunks: string[]) => <Strong>{chunks}</Strong>,
		colored: (...chunks: string[]) => <Colored style={{ color: options?.color }}>{chunks}</Colored>,
		bold: (...chunks: string[]) => <Bold>{chunks}</Bold>,
	} as const;
}

export function useI18n(options?: FormatterOptions) {
	const intl = useIntl();

	return {
		...intl,
		format: useCallback(
			(key: WordingKey, values?: Record<string, string | number | boolean | Date | null | undefined> | undefined) => {
				try {
					return intl.formatMessage({ id: key }, { ...values, ...createXmlFormatters(options) }) as string;
				} catch (e) {
					//TODO send to sentry
					if (key === undefined) {
						console.warn("[INTL] missing mandatory i18n key.");
						return "";
					} else {
						console.warn("[INTL] unknown key", key);
						return "";
					}
				}
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
				return `${hourCount} h ${minuteCount.toString().padStart(2, "0")} min`;
			} else if (hourCount > 0) {
				return `${hourCount} h`;
			} else {
				return `${minuteCount} min`;
			}
		},
		formatSignalQuality: (signalQuality: SignalQuality) => {
			switch (signalQuality) {
				case SignalQuality.POOR:
					return intl.formatMessage({ id: "score.quality.poor" });
				case SignalQuality.GOOD:
					return intl.formatMessage({ id: "score.quality.good" });
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
		formatTranquility: (scoreQuality: ScoreQuality) => {
			switch (scoreQuality) {
				case ScoreQuality.POOR:
					return intl.formatMessage({ id: "sleep.tranquility.very_agitated" });
				case ScoreQuality.GOOD:
					return intl.formatMessage({ id: "sleep.tranquility.agitated" });
				case ScoreQuality.OPTIMAL:
					return intl.formatMessage({ id: "sleep.tranquility.calm" });
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
			const weekends = [Weekdays.SATURDAY, Weekdays.SUNDAY];

			if (everydays.every((day) => days.includes(day))) {
				return intl.formatMessage({ id: "alarm.everydays" });
			} else if (weekdays.every((day) => days.includes(day))) {
				return intl.formatMessage({ id: "alarm.weekdays" });
			} else if (weekends.every((day) => days.includes(day))) {
				return intl.formatMessage({ id: "alarm.weekends" });
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
					return "1:15 " + intl.formatMessage({ id: "alarm.new.snooze.hour" });
				case 5:
					return "1:30 " + intl.formatMessage({ id: "alarm.new.snooze.hour" });
				case 0:
					return intl.formatMessage({ id: "alarm.new.snooze.off" });
			}
		},
		formatMelody: (melody: Melody) => {
			return intl.formatMessage({ id: "alarm.new.edit_vibration.type." + melody });
		},
		formatDateInterval: (start: Date, end: Date, dateFormat: string | undefined = "hh : mm A") => {
			return `${dayjs(start).format(dateFormat)} ${intl.formatMessage({ id: "global.date_interval_linker" })} ${dayjs(
				end
			).format(dateFormat)}`;
		},

		formatNoteIntervalLinker: () => {
			return `${intl.formatMessage({ id: "global.date_interval_linker" })}`;
		},
		formatHour: (date: Date, is24h: boolean) =>
			is24h ? dayjs(date).format("HH : mm") : dayjs(date).format("hh : mm A"),
		formatDate: (date: Date | undefined) => {
			if (date) {
				const isUSCS = useIsUSCS();
				// CIR-733 Stay in UTC to prevent date shift
				return isUSCS ? dayjs.utc(date).format("MM/DD/YYYY") : dayjs(date).format("DD/MM/YYYY");
			}
		},
		formatTemperature: (temperature: number, isCelsius: boolean) =>
			isCelsius ? `${temperature} °C` : `${(temperature * 9) / 5 + 32} °F`,
	};
}
