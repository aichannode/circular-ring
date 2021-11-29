import { Observable, observable } from "micro-observables";
import { HomeBanner } from "./homeBanner";
import { HomeBannerApi } from "./homeBannerApi";
import { NotificationStorage } from "./notificationStorage";

export class HomeBannerService {
	private serverBanners = observable<HomeBanner[]>([]);
	private clientSideClosed = observable<number[]>([]);

	banners: Observable<HomeBanner[]>
	
	constructor(private readonly notificationStorage: NotificationStorage, private readonly homeBannerApi: HomeBannerApi) {
		// This is a little optimistic UI for the notification.
		// This compute a view of the banners.
		// It get the server banners and remove closed banners which are on the client side.
		this.banners = Observable.select(
			[this.serverBanners, this.clientSideClosed],
			(banners, ids) => banners.filter((banner) => !ids.includes(banner.id))
		);
	}

	async init() {
		const infos = await this.notificationStorage.load();
		if (infos) {
			this.clientSideClosed.set(infos.clientSideClosed);
		}
	}

	async fetchBanners() {
		const bannersFromServer = await this.homeBannerApi.getBanners()
		this.serverBanners.set(bannersFromServer);
	}

	_DEBUG_reset = async () => {
		console.log('reset')
		this.notificationStorage.save([])
		this.clientSideClosed.set([])
		await this.homeBannerApi._DEBUG_insertData();
		this.fetchBanners()
	}

	/**
	 * Processus for closing the home banner.
	 * As long as we haven't checked the server data again. We maintain the "closed" state
	 * of the local banner (on storage). This avoids having banner "blinks",
	 * for example, when before the server has closed the banner and we receive a feed update. (the banner would "blink": closed-> open-> closed)
	 * During the next refetch we see if the banner has been removed. If so, we also remove it from our storage.
	 */
	closeNotification(id: number) {
		this.clientSideClosed.update(ids => [...ids, id])
		// side effect (fire and forget)
		this.homeBannerApi.closeBanners([id])
		// now, refetch the banners to sync with the server
		this.fetchBanners()
			// Remove all ID from the closed banner buffer in the storage which are no longer present on the server.
			.then(() => {
				const serverNotificationsIds = this.serverBanners.get().map(({id}) => id)
				 // keep notification which are still on the server
				this.clientSideClosed.update(ids => ids.filter(id => serverNotificationsIds.includes(id)))
				// store the remaining ids which are not close yet on the server
				this.notificationStorage.save(this.clientSideClosed.get())
			})
		
	}
}
