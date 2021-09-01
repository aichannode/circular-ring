import { css } from "styled-components/native";
import { colors } from "./colors";

export const textStyles = {
	primary: css`
		font-size: 16px;
		color: ${colors.textPrimary};
	`,
	secondary: css`
		font-size: 14px;
		color: ${colors.textSecondary};
	`,
} as const;
