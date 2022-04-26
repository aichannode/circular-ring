import { useRepresentations } from "@core/representation";
import { isDefined, toISOMonth } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { ActivityData30D, DataControlState } from "@domain/measure/representation/api";
import { useUser } from "@domain/user/hooks/useUser";
import { createActiveMode, isInDisabledMode, updateMode } from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { Spinner } from "@ui/components/spinner";
import { Tags } from "@ui/components/Tags";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import { hasAttributesDefined } from "@ui/utils/filter";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { ActivityLegend } from "./ActivityLegend";

const yValueFormatter = [
	"",
	"30min",
	...Array(16)
		.fill(0)
		.map((_, i) => `${1 + Math.floor(i / 2)}h${i % 2 !== 0 ? "30" : ""}`),
];

interface Data {
	x: number;
	y: number;
}

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
};

export const ActivityIntensityAllGraph: React.FC<Props> = observer(function ActivityIntensityAllGraph({
	selectedDay,
	mode = createActiveMode(),
}: Props) {
	const user = useUser();
	const beginDay = (user ? moment(user.createdAt).format("YYYY-MM-DD") : "2020-01-01") as ISODay;

	const {
		measure: {
			hooks: { useAllActivity },
		},
		calendar: {
			hooks: { useRangeTags },
		},
	} = useRepresentations();

	const tags = useRangeTags(beginDay, moment(selectedDay).endOf("day").toISOString() as ISODay);
	const allActivity = useAllActivity(toISOMonth(beginDay), toISOMonth(selectedDay));

	const lines = allActivity
		? ([...allActivity.activityMetrics]
				.filter((line) => hasAttributesDefined(line, ["high", "low", "medium"]))
				.reverse() as Required<ActivityData30D>[])
		: [];

	const [highData, mediumData, lowData] = lines.reduce<[Data[], Data[], Data[]]>(
		([highData, mediumData, lowData], item, index) => [
			// XXX: Graph unit is 30min so, as data are in hour, we need to multiply by 2.
			[...highData, { x: index, y: item.high * 2 }],
			[...mediumData, { x: index, y: item.medium * 2 }],
			[...lowData, { x: index, y: item.low * 2 }],
		],
		[[], [], []]
	) || [[], [], []];
	const xAxis = lines.map((item) => moment(item.date).format("MMM."));

	const updatedMode = updateMode(mode, allActivity?.controlState !== DataControlState.READY || lines.length === 0);
	const isLoading = !isDefined(allActivity);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Spinner size={24} />
			</View>
		);
	}
	return (
		<>
			<Tags tags={isInDisabledMode(updatedMode) ? [] : tags} />
			<View style={{ height: 200 }}>
				<LineChart
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					shouldDrawCircles={true}
					valueFormatter={xAxis || []}
					yValueFormatter={yValueFormatter}
					mode={updatedMode}
					daysItem={[
						{ lines: highData, color: colors.business.activityStageHigh },
						{ lines: mediumData, color: colors.business.activityStageMedium },
						{ lines: lowData, color: colors.business.activityStageLow },
					]}
					labelFormatter={(x, y, index) => {
						const values = [highData[index].y, mediumData[index].y, lowData[index].y]
							.map((val) => val / 2)
							.sort((a, b) => b - a)
							.map((val) => {
								const hours = Math.floor(val).toString();
								const min = Math.floor((val % 1) * 60).toString();
								return `${hours.padStart(2, "0")}:${min.padStart(2, "0")}`;
							});
						return `${moment(allActivity?.activityMetrics[index].date).format("ddd DD")}\n${values.join("\n")}`;
					}}
					highlightPerTapEnabled
					scaleXEnabled={false}
					shouldShowMarker
					shouldShowLabel
					isMultipleLines
				/>
			</View>
			<View style={{ marginTop: 30 }}>
				<ActivityLegend {...allActivity?.constant} mode={updatedMode} />
			</View>
		</>
	);
});
