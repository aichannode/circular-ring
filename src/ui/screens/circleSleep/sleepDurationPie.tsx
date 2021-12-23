import { DailySleepPhase, DurationInfos } from "@domain/measure/type";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

type Props = {
	durationData: DurationInfos<DailySleepPhase>;
}

function getPhaseLevel(phase?: string) {
    return Number(phase === DailySleepPhase.NAP || phase === DailySleepPhase.SLEEP)
}

function getLabels(
	phase: string,
	index: number,
	previousPhase?: string
): [WordingKey | null | "", WordingKey | null] {
	// Check with server
	if (phase === DailySleepPhase.LYING && index === 0) {
		return ["", null];
	}
	if (phase === DailySleepPhase.SLEEP && previousPhase === DailySleepPhase.LYING) {
		return ["sleep.duration.label.start_sleep", null];
	}
	if (phase === DailySleepPhase.AWAKE && previousPhase === DailySleepPhase.SLEEP) {
		return ["sleep.duration.label.wake_up", null];
	}
	if (phase === DailySleepPhase.NAP) {
		return ["sleep.duration.label.nap_start", "sleep.duration.label.nap_end"];
	}
	return [null, null];
}

export function SleepDurationPieChart({ durationData }: Props) {
	return (
		<Container>
            <DailyPieChart
                durationData={durationData}
                title="sleep.duration.total"
                chartSize={200}
                currentIsoDate={moment().hour(22).toISOString()}
				phaseColors={[colors.lightBlue, colors.darkBlue]}
				phaseWidths={[5, 7]}
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