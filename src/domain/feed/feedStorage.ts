import { Storage } from "@core/storage";
import { ReadNotifInfo } from "./type";

const feed = "@feed";

/**
 * Simple storage for notification closed state.
 */
export class FeedStorage {
	async save(clientSideClosed: number[]) {
		await Storage.save<ReadNotifInfo>(feed, { clientSideClosed });
	}

	async load(): Promise<ReadNotifInfo | null> {
		const infos = await Storage.load<ReadNotifInfo>(feed);
		return infos && { ...infos };
	}

	clear() {
		return Storage.remove(feed);
	}
}