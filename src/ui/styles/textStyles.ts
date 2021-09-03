import { css } from "styled-components/native";
import { colors } from "./colors";

export const textStyles = {
	titleMedium: css`
		font-size: 18px;
		font-weight: 500;
		color: ${colors.textPrimary};
	`,

	primary: css`
		font-size: 16px;
		color: ${colors.textPrimary};
	`,
	secondary: css`
		font-size: 14px;
		color: ${colors.textSecondary};
	`,
} as const;
