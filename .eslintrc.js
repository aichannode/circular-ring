/**
 * Shared config for ESlint.
 * This config is extended by each package to fit theuir needs.
 * This solution is prefered vs a single file with multiple project because,
 * for some reasons, the performances were decrease by 10x.
 * (linting a file was 1.5s long vs 150 with this solution)
 */

module.exports = {
	root: true,
	env: {
		node: true,
		jest: true,
	},
	parser: "@typescript-eslint/parser",
	extends: [
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier/@typescript-eslint",
		"plugin:prettier/recommended",
		"plugin:react/recommended",
	],
	rules: {
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"prettier/prettier": "warn",
		"react/no-unescaped-entities": "off",
	},
	parserOptions: {
		sourceType: "module",
		tsconfigRootDir: __dirname,
		project: "./tsconfig.json",
	},
	plugins: ["@typescript-eslint/eslint-plugin", "react"],
	settings: {
		react: {
			version: "detect",
		},
	},
};
