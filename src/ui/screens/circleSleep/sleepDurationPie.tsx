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

function getPhaseLevel(phase = 4) {
    return phase < 4
		? 1
		: 0
}

function createLabelGenerator(stages: Array<StageInfos<SleepStage>>) {
	return function getLabels(
		_phase: number,
		index: number
	): [WordingKey | null | "", WordingKey | null] {
		if (index === 0) {
			return ["sleep.duration.label.start_sleep", null];
		}
		if (index === stages.length - 1) {
			return [null, "sleep.duration.label.wake_up"];
		}
		return [null, null];
	}
}

export function SleepDurationPieChart({ stages, duration }: Props) {
	return (
		<Container>
            <DailyPieChart
                stages={stages}
				totalDuration={duration}
                title="sleep.duration.total"
                chartSize={200}
                currentIsoDate={moment().toISOString()}
				phaseColors={[colors.lightBlue, colors.darkBlue]}
				phaseWidths={[5, 7]}
                getPhaseLevel={getPhaseLevel}
                getLabels={createLabelGenerator(stages)}
            />
		</Container>
	);
}

const Container = styled.View`
	background-color: ${colors.lightgray};
	align-items: center;
	padding: 50px;
`;