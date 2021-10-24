import { ApiService } from "@core/api/apiService";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import { UserRing } from "./ring";

const ringApiBaseUrl = "/rings";

const tempSyncDataFile = (Platform.OS === "android" ? "file://" : "") + RNFS.DocumentDirectoryPath + "/sync-temp.txt";

export class RingApi {
	constructor(private readonly apiService: ApiService) {}

	async getRings(): Promise<UserRing[]> {
		const result = await this.apiService.get<UserRing[]>(`${ringApiBaseUrl}`);
		return result.data;
	}

	async addRing(ring: PostUserRing): Promise<UserRing> {
		const result = await this.apiService.post<UserRing>(`${ringApiBaseUrl}`, ring);
		return result.data;
	}

	deleteRing(ringId: string) {
		return this.apiService.delete(`${ringApiBaseUrl}/${ringId}`);
	}

	async sendData(ring: UserRing, rawData: string) {
		console.log('🗒 rawData',rawData)
		await RNFS.writeFile(tempSyncDataFile, rawData, "utf8");

		const formData = new FormData();
		formData.append("ringId", ring.id);
		formData.append("firmware", ring.firmware);
		formData.append("file", {
			uri: tempSyncDataFile,
			type: "text/plain",
			name: "sync.txt",
		});
	
		try {
			await this.apiService.post(`${ringApiBaseUrl}/raw-data/sync`, formData);
		} finally {
			RNFS.unlink(tempSyncDataFile);
		}
	}

	async submitFirmwareVersion(id : string, version: string): Promise<void>{
		const data = {
			"firmware" : version
		}
		  await this.apiService.put(`${ringApiBaseUrl}/${id}`, data);
	}
}

type PostUserRing = Omit<UserRing, "userId" | "lastSyncDate">;
