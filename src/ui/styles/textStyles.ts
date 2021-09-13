import { css } from "styled-components/native";
import { colors } from "./colors";

export const textStyles = {
	bigTitle: css`
		font-size: 20px;
		font-weight: 500;
		color: ${colors.textPrimary};
	`,

	mediumTitle: css`
		font-size: 18px;
		font-weight: 500;
		color: ${colors.textPrimary};
	`,

	subtitle: css`
		font-size: 14px;
		font-weight: bold;
		color: ${colors.textPlaceholder};
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
	title: css`
		font-size: 18px;
		font-weight: 500;
		color: ${colors.textPrimary};
	`,
} as const;
