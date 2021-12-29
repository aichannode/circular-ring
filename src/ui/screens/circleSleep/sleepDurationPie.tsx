import { StageInfos } from "@domain/measure/representation/type";
import { SleepStage } from "@domain/measure/type";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

type Props = {
	duration: number;
	stages: Array<StageInfos<SleepStage>>;
}

function getPhaseLevel(phase?: number) {
    return phase ?? 1
}

function getLabels(
	phase: number,
	index: number,
	previousPhase?: number
): [WordingKey | null | "", WordingKey | null] {
	if (phase === SleepStage.REM && index === 0) {
		return ["sleep.duration.label.start_sleep", null];
	}
	if (phase === SleepStage.AWAKE && previousPhase === SleepStage.REM) {
		return ["sleep.duration.label.wake_up", null];
	}
	return [null, null];
}

export function SleepDurationPieChart({ stages, duration }: Props) {
	return (
		<Container>
            <DailyPieChart
                stages={stages}
				totalDuration={duration}
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