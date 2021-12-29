import { StageInfos } from "@domain/measure/representation/type";
import { ActivityStage } from "@domain/measure/type";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

type Props = {
	duration: number;
	stages: Array<StageInfos<ActivityStage>>;
}

 function getPhaseLevel(phase?: number) {
    switch(phase) {
		case ActivityStage.LOW:
			return 1
		case ActivityStage.MEDIUM:
		case ActivityStage.HIGH:
			return 2
		default:
			return 0
	}
}

function getLabels(
	phase: number,
	_index: number,
	previousPhase?: number
): [WordingKey | null | "", WordingKey | null] {
	// Check with server
	if (previousPhase === ActivityStage.LOW && (phase === ActivityStage.MEDIUM || phase === ActivityStage.HIGH)) {
		return ["activity.duration.label.sport_start", null];
	}
	if ((previousPhase === ActivityStage.MEDIUM || previousPhase === ActivityStage.HIGH) && phase === ActivityStage.LOW) {
		return ["activity.duration.label.sport_end", null];
	}
	return [null, null];
}

export function ActivityDurationPieChart({ stages, duration }: Props) {
	return (
		<Container>
            <DailyPieChart
                stages={stages}
				totalDuration={duration}
                title="activity.duration.total"
                chartSize={200}
                currentIsoDate={moment().hour(22).toISOString()}
				phaseColors={[colors.business.activityNone, colors.business.activityLow, colors.business.activityHigh]}
				phaseWidths={[5, 7, 7]}
                getPhaseLevel={getPhaseLevel}
                getLabels={getLabels}
            />
		</Container>
	);
}

const Container = styled.View`
	background-color: ${colors.lightgray};
	align-items: center;
	padding: 50px;
`;