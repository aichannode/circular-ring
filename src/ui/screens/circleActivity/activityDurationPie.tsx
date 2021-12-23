import { DailyActivityPhase, DurationInfos } from "@domain/measure/type";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

type Props = {
	durationData: DurationInfos<DailyActivityPhase>;
}

 function getPhaseLevel(phase?: string) {
    switch(phase) {
		case DailyActivityPhase.LOW:
			return 1
		case DailyActivityPhase.MEDIUM:
		case DailyActivityPhase.HIGH:
			return 2
		default:
			return 0
	}
}

function getLabels(
	phase: string,
	_index: number,
	previousPhase?: string
): [WordingKey | null | "", WordingKey | null] {
	// Check with server
	if (previousPhase === DailyActivityPhase.LOW && (phase === DailyActivityPhase.MEDIUM || phase === DailyActivityPhase.HIGH)) {
		return ["activity.duration.label.sport_start", null];
	}
	if ((previousPhase === DailyActivityPhase.MEDIUM || previousPhase === DailyActivityPhase.HIGH) && phase === DailyActivityPhase.LOW) {
		return ["activity.duration.label.sport_end", null];
	}
	return [null, null];
}

export function ActivityDurationPieChart({ durationData }: Props) {
	return (
		<Container>
            <DailyPieChart
                durationData={durationData}
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