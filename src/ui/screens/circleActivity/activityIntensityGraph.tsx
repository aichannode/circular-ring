import { VictoryChart, VictoryBar, VictoryAxis } from "victory-native";
import { colors, ActivityIntensityColors } from "@ui/styles/colors";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import moment from "moment";
import { useI18n } from "@ui/i18n";
import { VictoryAxisCommonProps } from "victory-core";
import { useCalendar } from "@domain/calendar/hooks/useCalendar";
import { View } from "react-native";
import React, { useState } from "react";
import dayjs from "dayjs";
import { FetchStrategy } from "@betomorrow/micro-stores";
import styled from "styled-components/native";

type Props = {
	samples: Array<{ isoTime: string; value: number }>;
};

export const ActivityIntensityGraph = ({ samples }: Props) => {
	const { format } = useI18n();
	const [
		selectedDay,
		/*setSelectedDay*/
		,
	] = useState(dayjs().format("YYYY-MM-DD"));
	const calendar = useCalendar(selectedDay, FetchStrategy.Once);
	const data = samples.map((data) => {
		return {
			y: data.value,
			x: data.isoTime,
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
			<NotesContainer>
				{calendar?.notes.map((note, key) => (
					<Note key={key}>{note.tag.name}</Note>
				))}
			</NotesContainer>
			<VictoryChart domain={{ x: [0, data.length + 8], y: [0, 4] }} height={230}>
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
									return [
										{
											target: "labels",
											mutation: (props: { text: "clicked" }) => {
												return props.text === "clicked" ? null : { text: "clicked" };
											},
										},
									];
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
			<GraphLegend
				rows={[
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
										backgroundColor: ActivityIntensityColors.HIGH,
									}}
								/>
							),
						},
						value: "1 h 00 min   (7%)",
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
						value: "2 h 00 min (14%)",
					},
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
										backgroundColor: ActivityIntensityColors.LOW,
									}}
								/>
							),
						},
						value: "10 h 30 min (79%)",
					},
				]}
			/>
		</GraphContainer>
	);
};

const NotesContainer = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`;

const Note = styled.Text`
	height: 14px;
	font-size: 9px;
	color: white;
	background-color: ${colors.orange};
	padding-horizontal: 8px;
	margin-horizontal: 4px;
	border-radius: 7px;
`;
