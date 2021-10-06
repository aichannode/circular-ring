export enum IconType {
	URL = "URL",
	LOCAL = "LOCAL",
}
export enum BannerAction {
	OPEN_WEB = "OPEN_WEB",
	APP_PAGE = "APP_PAGE",
}

export interface HomeBanner {
	id: number;
	title: string;
	body: string;
	iconType: IconType;
	icon: string;
	priority: 0;
	targetUserId: string;
	clientActions: [{ type: BannerAction; data: string }];

	// Not used so far:

	// startDate: Date;
	// endDate: Date;
}

export interface ReadBannersInfo {
	bannerIds: number[];
	lastRead?: Date;
}
