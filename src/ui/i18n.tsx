import { ScoreQuality } from "@domain/circleActivity/circleActivityData";
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
	};
}
