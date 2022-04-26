import { isDefined } from "@domain/common/business";
import { createActiveMode, isInDisabledMode, updateMode } from "@ui/business";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { MetaDataText, PrimaryText } from "../components/text";

type Props = {
	rows: Array<{
		label: string;
		element: { key: string; node: React.ReactNode };
		value?: string;
	}>;
	mode?: Mode;
};

function toColumns(rows: Props["rows"]): {
	labels: string[];
	elements: Array<{ key: string; node: React.ReactNode }>;
	values: Array<string | undefined>;
} {
	const data: {
		labels: string[];
		elements: Array<{ key: string; node: React.ReactNode }>;
		values: Array<string | undefined>;
	} = {
		labels: [],
		elements: [],
		values: [],
	};
	rows.forEach(function (row) {
		data.labels.push(row.label);
		data.elements.push(row.element);
		data.values.push(row.value);
	});
	return data;
}

export function GraphLegend({ rows, mode = createActiveMode() }: Props) {
	const data = toColumns(rows);
	const { format } = useI18n();

	return (
		<View style={{ flexDirection: "row" }}>
			<Column>
				{data.labels.map((label, index) => (
					<Cell
						key={label}
						style={{ paddingLeft: 30, justifyContent: "center", alignContent: "flex-start" }}
						isEven={index % 2 === 0}
					>
						<PrimaryText>{label}</PrimaryText>
					</Cell>
				))}
			</Column>
			<Column>
				{data.elements.map((element, index) => (
					<Cell key={element.key} style={{ paddingLeft: 10, justifyContent: "center" }} isEven={index % 2 === 0}>
						{element.node}
					</Cell>
				))}
			</Column>
			<Column style={{ flex: 1 }}>
				{data.values.map((value, index) => {
					const updatedMode = updateMode(mode, !isDefined(value));
					return (
						<Cell
							key={isInDisabledMode(updatedMode) ? `no-data-${index}` : `${value}-${index}`}
							style={{ paddingRight: 30, justifyContent: "center" }}
							isEven={index % 2 === 0}
						>
							<MetaDataText style={{ textAlign: "right" }}>
								{isInDisabledMode(updatedMode) ? format("global.no_data") : value}
							</MetaDataText>
						</Cell>
					);
				})}
			</Column>
		</View>
	);
}

const Column = styled.View`
	justify-content: center;
`;

const Cell = styled.View<{ isEven: boolean }>`
	height: 30px;
	background-color: ${({ isEven }) => (isEven ? colors.lightgray : colors.white)};
`;
