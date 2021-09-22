export enum BannerType {
	CALIBRATION = "CALIBRATION",
}

export interface HomeBannerBase {
	type: BannerType;
}

export interface StoredBanner extends HomeBannerBase {
	stored: Date;
}

export interface CalibrationBanner extends HomeBannerBase {
	type: BannerType.CALIBRATION;
	daysLeft: number;
}

export type HomeBanner = CalibrationBanner;
