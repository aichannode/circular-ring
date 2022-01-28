import { StageInfos } from "@domain/measure/representation/lib/type";
import { ActivityStage } from "@domain/measure/type";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { DailyPieChartLabelMappedToPhases } from "@ui/components/measure/dailyPieChartLabelMappedToPhases";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

type Props = {
	duration: number;
	stages: Array<StageInfos<ActivityStage>>;
};

function getPhaseLevel(phase = 4) {
	// console.log("FIX phase", phase - 1);
	return phase - 2;
}

function createLabelGenerator(stages: Array<StageInfos<ActivityStage>>) {
	return function getLabels(_phase: number, index: number): [WordingKey | null | "", WordingKey | null] {
		// if (index === 0) {
		// 	return ["sleep.duration.label.start_sleep", null];
		// }
		// if (index === stages.length - 1) {
		// 	return [null, "sleep.duration.label.wake_up"];
		// }
		if (index && stages[index].stage === 4 && stages[index - 1].stage !== 4) {
			return ["activity.duration.label.sport_start", null];
		}
		if (index && stages[index].stage !== 4 && stages[index - 1].stage === 4) {
			return ["activity.duration.label.sport_end", null];
		}
		return [null, null];
	};
}

export function ActivityDurationPieChart({ stages, duration }: Props) {
	return (
		<Container>
			<DailyPieChart
				stages={stages}
				totalDuration={duration}
				title="activity.duration.total"
				chartSize={200}
				currentIsoDate={moment().toISOString()}
				phaseColors={[colors.business.activityNone, colors.business.activityLow, colors.business.activityHigh]}
				phaseWidths={[5, 7, 7]}
				getPhaseLevel={getPhaseLevel}
			/>
			<DailyPieChartLabelMappedToPhases stages={stages} chartSize={200} getLabels={createLabelGenerator(stages)} />
		</Container>
	);
}

const Container = styled.View`
	background-color: ${colors.lightgray};
	align-items: center;
	padding: 50px;
`;
