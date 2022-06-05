import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState, Points } from "@domain/measure/representation/api";
import { useIsUSCS } from "@domain/user/hooks/useUser";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { BarChart } from "@ui/components/measure/barChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { GraphLegend } from "@ui/containers/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, Mode } from "@ui/type";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DashedLine from "react-native-dashed-line";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
};

export const TemperatureVariation30DGraph: React.FC<Props> = observer(function Spo2Graph({
	selectedDay,
	mode = createActiveMode(),
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);
	const [tags, setTags] = useState<CalendarTag[]>([]);
	const isUSCS = useIsUSCS();
	const {
		measure: {
			hooks: { useLast30DaysTemperatureVariation },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const data = useLast30DaysTemperatureVariation(selectedDay);
	const lines: Points = data
		? data.series
				.map((el) => {
					return {
						x: el ? moment(el.date).valueOf() : 0,
						y: el?.value ? el.value : 0,
					};
				})
				.reverse()
		: [];
	const updatedMode = updateMode(mode, data?.controlState !== DataControlState.READY);
	const valueFormatter = lines.map(({ x }) => {
		const day = moment(x).format("dd");
		return day !== "Invalid date" ? day[0] : "";
	});
	const constant = data?.constant;
	const averages: Averages = [];
	if (isDefined(constant)) {
		averages.push({
			value: constant.average,
			color: colors.darkBlue,
		});
	}

	useEffect(() => {
		if (isDefined(lines)) {
			setLoading(false);
		}
	}, [lines]);

	const toUpdateTag = (x: number) => {
		const date = moment(lines[x].x).format("Y-MM-DD") as ISODay;
		setTags(useDailyTags(date));
	};
	const [yMin, yMax] =
		lines.length > 0
			? [
					Math.min(...lines.filter((line) => line.y > -1000).map((line) => line.y)),
					Math.max(...lines.map((line) => line.y)),
			  ]
			: [0, 0];

	const toGetAverageValue = (value: number | undefined): string => {
		if (!isDefined(value)) return "-";
		if (value > 0) {
			return `+ ${value} °C`;
		}
		return `${value} °C`;
	};
	return isLoading ? (
		<Spinner size={24} />
	) : (
		<View>
			{/** Wait for available data on week/month */}
			<GraphContainer style={{ height: 400 }}>
				{(isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode)) && (
					<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
						{tags.map(({ name, id }) => (
							<View key={id} style={{ marginLeft: 8 }}>
								<Tag>{name}</Tag>
							</View>
						))}
					</View>
				)}
				<BarChart
					labelCount={20}
					averages={averages}
					shouldShowMarker={true}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={lines}
					valueFormatter={valueFormatter}
					graphColor={colors.business.sleepPrimary}
					onSelect={(x) => toUpdateTag(x)}
					mode={updatedMode}
					yMin={yMin > -1 ? -1 : yMin}
					yMax={yMax > 1 ? yMax : 1}
					mapMarker={(el) =>
						`${isUSCS ? dayjs(new Date(el.x)).format("MM/DD/YYYY") : dayjs(new Date(el.x)).format("DD/MM/YYYY")}\n${
							el.y > 0 ? "+" + el.y : el.y
						}`
					}
					isTemperature={true}
				/>
				<View style={{ marginTop: 20 }}>
					<GraphLegend
						mode={updatedMode}
						rows={[
							{
								label: format("hr.average"),
								element: {
									key: "temperature.average",
									node: (
										<View
											style={{
												width: 40,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.darkBlue} />
										</View>
									),
								},
								value: isDefined(constant?.average) ? toGetAverageValue(constant?.average) : "-",
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	);
});
