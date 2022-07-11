import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { shadow } from "@ui/styles/containerStyles";
import { getSports, SportType } from "@utils/sports";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, FlatListProps, View } from "react-native";
import styled from "styled-components/native";
import { PrimaryText, TertiaryText } from "./text";

export interface SportItemType {
	item: SportType;
	index: number;
}

export const SportsSelector = ({ onPressItem }: { onPressItem?: (arg0: SportType) => void }) => {
	const allSports = getSports();

	const [sports, setSports] = useState<SportType[]>([]);
	const [idSelected, setIdSelected] = useState<number | null>(null);

	const { format } = useI18n();

	useEffect(() => {
		setSports(allSports.sort((a, b) => a.title.localeCompare(b.title)));
	}, []);

	const renderItem = ({
		item,
		index,
		withFirstLetter = true,
	}: {
		item: SportType;
		index: number;
		withFirstLetter?: boolean;
	}) => {
		const { title, icon } = item;

		const selectItem = () => {
			onPressItem && onPressItem(item);
			setIdSelected(item.id);
		};

		const isNewLetter = () => {
			if (index === 0) return true;
			return title[0] !== sports[index - 1].title[0];
		};

		return (
			<View key={index}>
				{withFirstLetter && isNewLetter() && <TextSeparator>{title[0].toUpperCase()}</TextSeparator>}
				<SportContainer onPress={selectItem}>
					<LeftSportContainer>
						<SportImg source={icon} />
						<SportTitle>{title}</SportTitle>
					</LeftSportContainer>
					<RightSportContainer>
						<SportSeparator />
						{idSelected === item.id ? (
							<CheckImage source={require("@assets/images/circularCheckRed.png")} />
						) : (
							<EmptyCheck />
						)}
					</RightSportContainer>
				</SportContainer>
			</View>
		);
	};

	//Fake data while waiting for the connection with the back
	const headerData = [allSports[0], allSports[1]];

	const renderHeader = useMemo(() => {
		return (
			<>
				<TextSeparator>{format("sport.selector.recent")}</TextSeparator>
				{headerData?.map((item, index) => renderItem({ item, index, withFirstLetter: false }))}
			</>
		);
	}, [headerData, idSelected]);

	return (
		<ScrollableContainer
			keyExtractor={(item) => item.id.toString()}
			data={sports}
			renderItem={({ item, index }) => renderItem({ item, index })}
			ListHeaderComponent={renderHeader}
			scrollEnabled={false}
		/>
	);
};

const ScrollableContainer = styled(FlatList as new (props: FlatListProps<SportType>) => FlatList<SportType>)`
	margin-horizontal: 40px;
`;

const TextSeparator = styled(TertiaryText)`
	margin-bottom: 8px;
`;

const SportContainer = styled.TouchableOpacity`
	height: 50px;
	padding: 0 15px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: ${colors.white};
	border-radius: 10px;
	margin-bottom: 8px;
	${shadow("0 2px", 5, 0.25)};
`;

const SportImg = styled.Image`
	margin-right: 15px;
	resize-mode: contain;
	width: 30px;
	height: 30px;
`;

const SportTitle = styled(PrimaryText)``;

const SportSeparator = styled.View`
	background-color: ${colors.gray};
	width: 1px;
	height: 25px;
	margin-right: 15px;
`;

const CheckImage = styled.Image`
	resize-mode: contain;
	width: 30px;
`;

const EmptyCheck = styled.View`
	width: 30px;
`;

const LeftSportContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;

const RightSportContainer = styled.View`
	height: 100%;
	flex-direction: row;
	align-items: center;
`;
