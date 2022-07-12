import { FeedRecommendation } from "@domain/feed/type";
import { DateFormat } from "@domain/units";
import { useConnectionStartTime, useUserSettings } from "@domain/user/hooks/useUser";
import { MetaDataText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import AnimatedViewRecommendation from "./AnimatedViewRecommendation";
import { Recommendation } from "./Recommendation";

type Props = {
	loading: boolean;
	date: string;
	recommendations: Record<string, FeedRecommendation[]>;
};

const RecommendationWrapper: React.FC<Props> = ({ loading, date, recommendations }) => {
	const connectionStartTime = useConnectionStartTime();
	const userSettings = useUserSettings();

	const { format } = useI18n();

	const dateFormat = userSettings?.dateFormat === DateFormat.SI ? "DD/MM/YYYY" : "MM/DD/YYYY";
	return (
		<View style={{ paddingHorizontal: 6 }} key={date}>
			{date !== "today" && (
				<View style={{ alignItems: "center", marginTop: 15 }}>
					<Separator />
					<MetaDataText style={{ paddingHorizontal: 8, fontSize: 8, backgroundColor: colors.lightgray }}>
						{date === "yesterday" ? format("global.yesterday").toUpperCase() : moment(date).format(dateFormat)}
					</MetaDataText>
				</View>
			)}
			{recommendations[date].map((banner) =>
				moment(banner.startDate).isAfter(connectionStartTime) && recommendations[date].indexOf(banner) === 0 ? (
					<AnimatedViewRecommendation key={banner.id} loading={loading} recommendation={banner} />
				) : (
					<Recommendation key={banner.id} recommendation={banner} style={{ margin: 10 }} />
				)
			)}
		</View>
	);
};
export default RecommendationWrapper;

const Separator = styled.View`
	height: 1px;
	position: absolute;
	left: 20px;
	top: 5px;
	right: 20px;
	background-color: ${colors.gray};
`;
