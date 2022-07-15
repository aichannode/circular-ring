import { useServices } from "@core/services";
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
	const userService = useServices().userService;

	useEffect(() => {
		if (!loading) {
			recommendationsAnim.setValue(0);
			animation.start();
			setTimeout(() => userService.connectionStartTime.set(new Date().toISOString()), 1500);
		}
	}, [recommendationsAnim, loading]);

	return (
		<Animated.View
			style={{
				top: -200,
				flex: 1,
				transform: [{ translateY: recommendationsAnim }],
			}}
		>
			<Fade isVisible isAnimatedOnMount duration={2000}>
				<Recommendation recommendation={recommendation} style={{ margin: 10 }} />
			</Fade>
		</Animated.View>
	);
};
export default AnimatedViewRecommendation;
