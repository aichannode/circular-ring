import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState } from "@domain/measure/representation/api";
import { useIsUSCS } from "@domain/user/hooks/useUser";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
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

export const BRGraph30days: React.FC<Props> = observer(function BRGraph30days({
	selectedDay,
	mode = createActiveMode(),
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);
	const isUSCS = useIsUSCS();
	const {
		measure: {
			hooks: { useLast30DaysBR },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const dailyBR = useLast30DaysBR(selectedDay);
	const [lines, constant] = [
		dailyBR
			? dailyBR.series
					.map((el) => {
						return {
							x: el ? moment(el.date).valueOf() : 0,
							y: el?.value ? el.value : 0,
						};
					})
					.reverse()
			: [],
		dailyBR ? dailyBR.constant : { average: 0, reference: 0 },
	];

	const updatedMode = updateMode(mode, dailyBR?.controlState !== DataControlState.READY);

	const [yMin, yMax] =
		lines.length > 0
			? [
					Math.min(...lines.filter((line) => line.y > 0).map((line) => line.y)),
					Math.max(...lines.map((line) => line.y)),
			  ]
			: [0, 0];
	const tags = useDailyTags(selectedDay);

	const averages: Averages = [];

	if (isInActiveMode(updatedMode) && constant.reference !== -1) {
		averages.push({
			value: constant.reference,
			color: colors.redLight,
		});
	}
	if ((isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode)) && constant.average !== -1) {
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
				<LineChart
					averages={averages}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					daysItem={[{ lines: lines, color: colors.darkBlue }]}
					shouldShowLabel={true}
					shouldShowMarker={true}
					shouldDrawCircles={false}
					graphColor={colors.darkBlue}
					valueFormatter={lines.map((item) => moment(item.x).format("dd")[0])}
					yMin={Math.floor(yMin)}
					yMax={Math.ceil(yMax)}
					mode={updatedMode}
					shouldUpdateYmin={false}
					highlightPerTapEnabled={true}
					isMultipleLines={true}
					labelFormatter={(x, y) => {
						return isUSCS
							? `${dayjs(new Date(x)).format("MM/DD/YYYY")}\n${Math.round(y)}`
							: `${dayjs(new Date(x)).format("DD/MM/YYYY")}\n${Math.round(y)}`;
					}}
					zoom={
						lines?.length > 0
							? {
									scaleX: 2,
									scaleY: 1,
									xValue: lines[lines.length - 1].x,
									yValue: 1,
							  }
							: undefined
					}
				/>
				<View style={{ marginTop: 20 }}>
					<GraphLegend
						mode={updatedMode}
						rows={[
							{
								label: format("30day.average"),
								element: {
									key: "30day.average",
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
								value:
									lines.length == 0
										? format("global.no_data")
										: typeof constant.average == "undefined" || constant.average === -1
										? "- %"
										: `${Math.round(constant.average)} %`,
							},
							{
								label: format("hr.reference"),
								element: {
									key: "hr.reference",
									node: (
										<View
											style={{
												width: 40,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.redLight} />
										</View>
									),
								},
								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: lines.length == 0
									? format("global.no_data")
									: typeof constant.reference == "undefined" || constant.reference === -1
									? "- %"
									: `${Math.round(constant.reference)} %`,
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	);
});
