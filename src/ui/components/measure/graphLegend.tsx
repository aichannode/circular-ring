import { colors } from "@ui/styles/colors";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { MetaDataText, PrimaryText } from "../text";

type Props = {
	rows: Array<{
		label: string;
		element: { key: string; node: React.ReactNode };
		value: string;
	}>;
};

function toColumns(rows: Props["rows"]): {
	labels: string[];
	elements: Array<{ key: string; node: React.ReactNode }>;
	values: string[];
} {
	const data: {
		labels: string[];
		elements: Array<{ key: string; node: React.ReactNode }>;
		values: string[];
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

export function GraphLegend({ rows }: Props) {
	const data = toColumns(rows);
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
				{data.values.map((value, index) => (
					<Cell key={value} style={{ paddingRight: 30, justifyContent: "center" }} isEven={index % 2 === 0}>
						<MetaDataText style={{ textAlign: "right" }}>{value}</MetaDataText>
					</Cell>
				))}
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
