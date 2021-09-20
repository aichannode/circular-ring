/**
 * Weight
 */

export enum WeightUnit {
	kg,
	lbs,
}

const KG_TO_LBS = 2.205;

export function kgToLbs(kgWeight: number) {
	return kgWeight * KG_TO_LBS;
}

export function lbsToKg(lbsWeight: number) {
	return lbsWeight / KG_TO_LBS;
}

/**
 * Height
 */

export enum HeightUnit {
	cm,
	ft,
}

const FT_TO_CM = 30.48;

export function cmToFt(cmHeight: number) {
	return cmHeight / FT_TO_CM;
}

export function ftToCm(ftHeight: number) {
	return ftHeight * FT_TO_CM;
}
