import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { ActivityData } from "@domain/measure/representation/api";
import { useIsUSCS } from "@domain/user/hooks/useUser";
import { createActiveMode, isInDisabledMode, updateMode } from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { Spinner } from "@ui/components/spinner";
import { Tags } from "@ui/components/Tags";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import { hasAttributesDefined } from "@ui/utils/filter";
import dayjs from "dayjs";
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
		.map((_, i) => `${1 + Math.floor(i / 2)}h  ${i % 2 !== 0 ? "30" : ""}`),
];

interface Data {
	x: number;
	y: number;
}

type Props = {
	selectedDay: string;
	mode?: Mode;
};

export const ActivityIntensity7DGraph: React.FC<Props> = observer(function ActivityIntensity7DGraph({
	selectedDay,
	mode = createActiveMode(),
}: Props) {
	const { formatDuration } = useI18n();
	const isUSCS = useIsUSCS();
	const {
		measure: {
			hooks: { use7DaysActivity },
		},
		calendar: {
			hooks: { useRangeTags },
		},
	} = useRepresentations();

	const tags = useRangeTags(
		moment(selectedDay).subtract(7, "days").toISOString() as ISODay,
		moment(selectedDay).endOf("day").toISOString() as ISODay
	);
	const activity7D = use7DaysActivity(selectedDay as ISODay);
	const lines = activity7D
		? ([...activity7D.activityMetrics]
				.filter((line) => hasAttributesDefined(line, ["high", "low", "medium"]))
				.reverse() as Required<ActivityData>[])
		: [];
	const [highData, mediumData, lowData] = lines.reduce<[Data[], Data[], Data[]]>(
		([highData, mediumData, lowData], item, index) => [
			// XXX: Graph unit is 30min so, as data are in minutes, we need to divide them by 30.
			[...highData, { x: index, y: item.high / 30 }],
			[...mediumData, { x: index, y: item.medium / 30 }],
			[...lowData, { x: index, y: item.low / 30 }],
		],
		[[], [], []]
	) || [[], [], []];
	const xAxis = lines.map((item) => moment(item.date).format("dd")[0].toUpperCase());
	const [yMin, yMax] = [
		Math.min(
			...[
				Math.min(...highData.map((line) => line.y)),
				Math.min(...mediumData.map((line) => line.y)),
				Math.min(...lowData.map((line) => line.y)),
			].map((el) => el)
		),
		Math.max(
			...[
				Math.max(...highData.map((line) => line.y)),
				Math.max(...mediumData.map((line) => line.y)),
				Math.max(...lowData.map((line) => line.y)),
			].map((el) => el)
		),
	];
	const updatedMode = updateMode(mode, lines.length === 0);
	const isLoading = !isDefined(activity7D);

	return (
		<>
			<Tags tags={isInDisabledMode(updatedMode) ? [] : tags} />
			<View style={{ height: 200 }}>
				{isLoading ? (
					<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
						<Spinner size={35} />
					</View>
				) : (
					<LineChart
						xColor={colors.textPrimary}
						yColor={colors.darkGray}
						shouldDrawCircles={true}
						valueFormatter={xAxis || []}
						yValueFormatter={yValueFormatter}
						minimumYValueAllowed={0}
						yMin={yMin}
						yMax={yMax}
						mode={updatedMode}
						daysItem={[
							{ lines: highData, color: colors.business.activityStageHigh },
							{ lines: mediumData, color: colors.business.activityStageMedium },
							{ lines: lowData, color: colors.business.activityStageLow },
						]}
						labelFormatter={(x, y, index) => {
							const values = [highData[index].y, mediumData[index].y, lowData[index].y]
								// XXX: As graph data are expressed in 30minutes, we need to multiply them by 30 to get them in minutes.
								.map((val) => val * 30)
								.sort((a, b) => b - a)
								.map((val) => formatDuration(val * 60));

							return isUSCS
								? `${dayjs(new Date(lines[index].date)).format("MM/DD/YYYY")}\n${values.join("\n")}`
								: `${dayjs(new Date(lines[index].date)).format("DD/MM/YYYY")}\n${values.join("\n")}`;
						}}
						highlightPerTapEnabled
						scaleXEnabled={false}
						shouldShowMarker
						shouldShowLabel
						isMultipleLines
					/>
				)}
			</View>
			<View style={{ marginTop: 20 }}>
				<ActivityLegend {...activity7D?.constant} mode={updatedMode} />
			</View>
		</>
	);
});
