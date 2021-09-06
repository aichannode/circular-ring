import { css } from "styled-components/native";
import { colors } from "./colors";

export const textStyles = {
	titleMedium: css`
		font-size: 18px;
		font-weight: 500;
		color: ${colors.textPrimary};
	`,

	errorMessage: css`
		font-size: 14px;
		font-weight: bold;
		color: ${colors.primary};
	`,

	bigButton: css`
		font-size: 17px;
		color: ${colors.textPrimary};
	`,

	primary: css`
		font-size: 15px;
		color: ${colors.textPrimary};
	`,
	secondary: css`
		font-size: 14px;
		color: ${colors.textSecondary};
	`,
} as const;
