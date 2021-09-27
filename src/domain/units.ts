/**
 * Weight
 */

import { arrayFromRange } from "@core/utils";

export enum WeightUnit {
	kg = "kg",
	lbs = "lbs",
}

const KG_MIN = 20;
const KG_MAX = 300;
const KG_INCREMENT = 1;
export const weightValuesKg = arrayFromRange(KG_MIN, KG_MAX, KG_INCREMENT);

const LBS_MIN = 45;
const LBS_MAX = 661;
const LBS_INCREMENT = 1;
export const weightValuesLbs = arrayFromRange(LBS_MIN, LBS_MAX, LBS_INCREMENT);

export const UNDEFINED_WEIGHT = 80;
export const defaultWeight = new Map<WeightUnit, number>([
	[WeightUnit.kg, UNDEFINED_WEIGHT],
	[WeightUnit.lbs, 170],
]);

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
	cm = "cm",
	ft = "ft",
}

const CM_MIN = 80;
const CM_MAX = 251;
const CM_INCREMENT = 1;
export const heightValuesCm = arrayFromRange(CM_MIN, CM_MAX, CM_INCREMENT);

const FT_MIN = 2.63;
const FT_MAX = 8.23;
const FT_INCREMENT = 0.01;
export const heightValuesFt = arrayFromRange(FT_MIN, FT_MAX, FT_INCREMENT);

const CM_STRIDE_MIN = 30;
const CM_STRIDE_MAX = 105;
const CM_STRIDE_INCREMENT = 1;
export const strideValuesCm = arrayFromRange(CM_STRIDE_MIN, CM_STRIDE_MAX, CM_STRIDE_INCREMENT);
const FT_STRIDE_MIN = 0.98;
const FT_STRIDE_MAX = 3.44;
const FT_STRIDE_INCREMENT = 0.01;
export const strideValuesFt = arrayFromRange(FT_STRIDE_MIN, FT_STRIDE_MAX, FT_STRIDE_INCREMENT);

export const UNDEFINED_HEIGHT = 170;
export const defaultHeight = new Map<HeightUnit, number>([
	[HeightUnit.cm, UNDEFINED_HEIGHT],
	[HeightUnit.ft, 6],
]);

const FT_TO_CM = 30.48;

export function cmToFt(cmHeight: number) {
	return cmHeight / FT_TO_CM;
}

export function ftToCm(ftHeight: number) {
	return ftHeight * FT_TO_CM;
}
