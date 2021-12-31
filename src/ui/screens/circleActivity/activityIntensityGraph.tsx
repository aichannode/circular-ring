import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel, Bar } from "victory-native";
import { colors, ActivityIntensityColors } from "@ui/styles/colors";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import moment from "moment";
import { useI18n } from "@ui/i18n";
import { mockActivityIntensity } from "./business.test";
import { VictoryAxisCommonProps } from "victory-core";
import { Text, View } from "react-native";
import React from "react";
import { Svg } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";

export const ActivityIntensityGraph = () => {
	const { format } = useI18n();
	const data = mockActivityIntensity.map((data) => {
		return {
			y: data.value,
			x: data.time,
		};
	});

	const axisYStyle: VictoryAxisCommonProps["style"] = {
		axis: {
			stroke: "transparent",
		},
		tickLabels: {
			fontSize: 10,
			color: colors.darkGray,
		},
		grid: { stroke: "#000", strokeWidth: 0.04 },
	};

	const axisXStyle: VictoryAxisCommonProps["style"] = {
		axis: {
			stroke: "transparent",
		},
		tickLabels: {
			fontSize: 10,
			color: colors.darkGray,
		},
	};
	return (
		<GraphContainer>
			<Svg>
				<VictoryChart domain={{ x: [0, data.length + 5], y: [0, 4] }} height={230}>
					<VictoryAxis
						tickFormat={(tick) => {
							if (parseInt(moment(tick).format("H")) % 2 === 0 && moment(tick).format("mm") === "00")
								return moment(tick).format("H") + " h";
							else return "";
						}}
						style={axisXStyle}
					/>
					<VictoryAxis
						// domain={yDomain}

						dependentAxis
						fixLabelOverlap
						style={axisYStyle}
						tickFormat={function (tick) {
							switch (tick) {
								case 1:
									return format("intensity.low");
								case 2:
									return format("intensity.medium");
								case 3:
									return format("intensity.high");
								default:
								case 1:
									return "Max HR";
							}
						}}
					/>
					<VictoryBar
						events={[
							{
								target: "data",
								eventHandlers: {
									onPressIn: () => {
										console.log("PRESS");
										return [
											{
												target: "labels",
												mutation: (props) => {
													return props.text === "clicked" ? null : { text: "clicked" };
												},
											},
										];
									},
									onMouseOver: () => {
										console.log("onMouseEnter");
									},
								},
							},
						]}
						barRatio={0.8}
						data={data}
						cornerRadius={{ top: 4, bottom: 4 }}
						style={{
							data: {
								fill: ({ datum }) => {
									// console.log("dATUm", datum);
									if (datum.y >= 3) return ActivityIntensityColors.HIGH;
									if (datum.y >= 2) return ActivityIntensityColors.MEDIUM;
									if (datum.y >= 1) return ActivityIntensityColors.LOW;
									return ActivityIntensityColors.NONE;
								},
								fillOpacity: 1,
							},
						}}
					/>
				</VictoryChart>
			</Svg>
			<GraphLegend
				rows={[
					{
						label: format("intensity.low"),
						element: {
							key: "intensity.low",
							node: (
								<View
									style={{
										borderRadius: 100,
										width: 10,
										height: 10,
										backgroundColor: ActivityIntensityColors.HIGH,
									}}
								/>
							),
						},
						value: "0 h 45 min (8%)",
					},
					{
						label: format("intensity.medium"),
						element: {
							key: "intensity.medium",
							node: (
								<View
									style={{
										borderRadius: 100,
										width: 10,
										height: 10,
										backgroundColor: ActivityIntensityColors.MEDIUM,
									}}
								/>
							),
						},
						value: "5 h 48 min (61%)",
					},
					{
						label: format("intensity.high"),
						element: {
							key: "intensity.high",
							node: (
								<View
									style={{
										borderRadius: 100,
										width: 10,
										height: 10,
										backgroundColor: ActivityIntensityColors.LOW,
									}}
								/>
							),
						},
						value: "0 h 48 min (9%)",
					},
				]}
			/>
		</GraphContainer>
	);
};
