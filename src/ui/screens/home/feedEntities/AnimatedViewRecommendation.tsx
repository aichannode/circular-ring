import { FeedRecommendation } from "@domain/feed/type";
import Fade from "@ui/components/fade";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Recommendation } from "./Recommendation";

type Props = {
	loading: boolean;
	recommendation: FeedRecommendation;
};

const AnimatedViewRecommendation: React.FC<Props> = ({ loading, recommendation }) => {
	const recommendationsAnim = useRef(new Animated.Value(0)).current;
	const animation = Animated.timing(recommendationsAnim, {
		toValue: 200,
		duration: 1500,
		useNativeDriver: true,
	});

	useEffect(() => {
		if (!loading) animation.start();
		else animation.stop();
	}, [recommendationsAnim]);

	return (
		<Animated.View
			style={{
				top: -200,
				flex: 1,
				transform: [{ translateY: recommendationsAnim }],
			}}
		>
			<Fade isVisible isAnimatedOnMount duration={1000}>
				<Recommendation recommendation={recommendation} style={{ margin: 10 }} />;
			</Fade>
		</Animated.View>
	);
};
export default AnimatedViewRecommendation;
