export enum BannerType {
	CALIBRATION = "CALIBRATION",
}

export interface HomeBanner {
	type: BannerType;
}

export interface StoredBanner extends HomeBanner {
	stored: Date;
}

export interface CalibrationBanner extends HomeBanner {
	type: BannerType.CALIBRATION;
	daysLeft: number;
}
