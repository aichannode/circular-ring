import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState, Points } from "@domain/measure/representation/api";
import { TemperatureFormat } from "@domain/units";
import { useIsUSCS, useUserSettings } from "@domain/user/hooks/useUser";
import { createActiveMode, isInActiveMode, updateMode } from "@ui/business";
import { BarChart } from "@ui/components/measure/barChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { GraphLegend } from "@ui/containers/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, Mode } from "@ui/type";
import { convertData, convertToF } from "@utils/temperature";
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

export const TemperatureVariation7DGraph: React.FC<Props> = observer(function Spo2Graph({
	selectedDay,
	mode = createActiveMode(),
}: Props) {
	const { format } = useI18n();
	const userSettings = useUserSettings();
	const [isLoading, setLoading] = useState(true);
	const [tags, setTags] = useState<CalendarTag[]>([]);
	const isUSCS = useIsUSCS();
	const {
		measure: {
			hooks: { useLast7DaysTemperatureVariation },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const isCelcius = userSettings?.temperatureFormat === TemperatureFormat.CELSIUS;
	const unitTemperature = isCelcius ? "°C" : "°F";

	const data = useLast7DaysTemperatureVariation(selectedDay);

	const currentData = data ? convertData(data, isCelcius) : [];

	const lines: Points = currentData
		? currentData
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
		const day = moment(x).format("dd").toUpperCase();
		return day !== "Invalid date" ? day[0].toUpperCase() : "";
	});
	const constant = data?.constant;
	const averages: Averages = [];
	if (isDefined(constant)) {
		averages.push({
			value: !isCelcius ? convertToF(constant.average) : constant.average,
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
	const yMax = lines.length > 0 ? Math.max(...lines.map((line) => (line.y === -1000 ? 0 : Math.abs(line.y)))) : 0;

	const toGetAverageValue = (value: number | undefined): string => {
		if (!isDefined(value)) return "-";
		const currentValue = isCelcius ? value : convertToF(value);

		if (currentValue > 0) {
			return `+ ${currentValue} ${unitTemperature}`;
		}
		return `${currentValue} ${unitTemperature}`;
	};

	return (
		<View>
			{/** Wait for available data on week/month */}
			<GraphContainer style={{ height: 400 }}>
				{isInActiveMode(updatedMode) && (
					<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
						{tags.map(({ name, id }) => (
							<View key={id} style={{ marginLeft: 8 }}>
								<Tag>{name}</Tag>
							</View>
						))}
					</View>
				)}
				{isLoading ? (
					<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
						<Spinner size={35} />
					</View>
				) : (
					<>
						<BarChart
							averages={averages}
							shouldShowMarker={true}
							xColor={colors.textPrimary}
							yColor={colors.darkGray}
							data={lines}
							valueFormatter={valueFormatter}
							graphColor={colors.business.sleepPrimary}
							onSelect={(x) => toUpdateTag(x)}
							yMin={-yMax}
							yMax={yMax}
							mapMarker={(el) =>
								`${isUSCS ? dayjs(new Date(el.x)).format("MM/DD/YYYY") : dayjs(new Date(el.x)).format("DD/MM/YYYY")}\n${
									el.y > 0 ? "+" + el.y : el.y
								}`
							}
							isTemperature={true}
						/>
						<View style={{ marginTop: 20 }}>
							<GraphLegend
								rows={[
									{
										label: format("activity.energy_score.7day"),
										element: {
											key: "temperature.average",
											node: (
												<View
													style={{
														width: 30,
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
					</>
				)}
			</GraphContainer>
		</View>
	);
});
