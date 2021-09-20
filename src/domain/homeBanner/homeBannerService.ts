import { CalibrationService } from "@domain/calibration/calibrationService";
import { Observable, observable } from "micro-observables";
import { BannerType, CalibrationBanner, HomeBanner, StoredBanner } from "./homeBanner";
import { HomeBannerStorage } from "./homeBannerStorage";
import dayjs from "dayjs";

export class HomeBannerService {
	private _dismissedBanner = observable<StoredBanner | null>(null);

	visibleBanner: Observable<CalibrationBanner | null>;

	constructor(
		private readonly homeBannerStorage: HomeBannerStorage,
		private readonly calibrationService: CalibrationService
	) {
		this.visibleBanner = Observable.select(
			[this._dismissedBanner, this.calibrationService.calibrationDaysLeft],
			(dismissed, daysLeft) => {
				if (dismissed?.type === BannerType.CALIBRATION) {
					return null;
				}
				return {
					type: BannerType.CALIBRATION,
					daysLeft,
				};
			}
		);
	}

	async init() {
		const storedBanner = await this.homeBannerStorage.load();
		if (storedBanner && hasBeenDismissedToday(storedBanner)) {
			this.homeBannerStorage.clear();
		} else {
			this._dismissedBanner.set(storedBanner);
		}
	}

	dismiss(banner: HomeBanner) {
		this.homeBannerStorage.save(banner);
	}
}

function hasBeenDismissedToday(banner: StoredBanner) {
	return dayjs(banner?.stored).isAfter(dayjs().startOf("day"));
}
