import { useServices } from "@core/services";
import { BirthControl } from "@domain/user/advancedInfo";
import { useUser, useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { advanceInfoI18nKey, birthControlKeys } from "@ui/screens/profile/advancedInformation/profileAdvancedInfoI18n";
import React, { useState } from "react";
import styled from "styled-components/native";

export const BirthControlEditionScreen = () => {
	const { format } = useI18n();
	const { userService } = useServices();
	const user = useUser();
	const advancedInfo = useUserAdvancedInfo();

	const [birthControlType, setBirthControlType] = useState(advancedInfo?.female.birthControl ?? BirthControl.NONE);

	return !advancedInfo || !advancedInfo.female ? null : (
		<ScrollScreen contentContainerStyle={{ paddingTop: 0 }}>
			<InfoListHeader>{format("profile_advanced_info.birth_control.selection_invitation")}</InfoListHeader>
			{[
				BirthControl.NONE,
				BirthControl.PILLS,
				BirthControl.CONDOMS,
				BirthControl.VAGINAL_RING,
				BirthControl.PATCH,
				BirthControl.IUD,
				BirthControl.IMPLANT,
				BirthControl.FERTILITY_AWARENESS,
				BirthControl.OTHER,
			].map((type) => (
				<ListItem
					key={type.toString()}
					separated={type === BirthControl.PILLS || type === BirthControl.OTHER}
					name={format(advanceInfoI18nKey(birthControlKeys, type))}
					checkable
					checked={advancedInfo.female.birthControl === type}
					action={() => setBirthControlType(type)}
				/>
			))}
		</ScrollScreen>
	);
};

const ListItem = styled(InfoListItem)<{ separated: boolean }>`
	margin-top: ${({ separated }) => (separated ? 20 : 0)}px;
`;
