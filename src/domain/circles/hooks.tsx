import { useServices } from "@core/services";
import { useEffect } from "react";

export const useFetchCircles = () => {
	const { circlesService } = useServices();
	useEffect(() => {
		circlesService.fetchUserCircles();
	}, []);
};
