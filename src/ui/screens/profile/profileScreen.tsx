import { useServices } from "@core/services";
import { InfoListItem } from "@ui/components/infoListItem";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import React, { useCallback } from "react";

export const ProfileScreen = () => {
	const { format } = useI18n();
	const { userService } = useServices();

	const logout = useCallback(async () => {
		await userService.logout();
	}, []);

	return (
		<ScrollScreen>
			<InfoListItem name={format("profile.logout")} action={logout} emphasize={true} />
		</ScrollScreen>
	);
};
