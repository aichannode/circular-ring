import {ApiService} from "@core/api/apiService";
import {Platform} from "react-native";
import RNFS from "react-native-fs";
import {UserRing} from "./ring";
import axios, {AxiosInstance} from "axios";
import {addRequestInterceptor, addResponseInterceptor} from "@core/api/interceptors/interceptor";
import {serializeArrayParametersInterceptor} from "@core/api/interceptors/serializeArrayParametersInterceptor";
import {logResponseInterceptor} from "@core/api/interceptors/logResponseInterceptor";
import {Logger} from "@betomorrow/logging-core";
import {getLogger} from "@core/logger/logger";
import {Task} from "@domain/task/task.model";
import {sleep} from "@utils/timing-utils";

const ringApiBaseUrl = "/rings";

const tempSyncDataFile = (Platform.OS === "android" ? "file://" : "") + RNFS.DocumentDirectoryPath + "/sync-temp.txt";

function isTaskRunning(status: string) {
    return status !== 'ENDED' && status !== 'CANCELLED' && status !== 'FAILED';
}

export class RingApi {
    private logger: Logger = getLogger("RingApi");
    private readonly instance: AxiosInstance;

    constructor(private readonly apiService: ApiService) {
        this.instance = axios.create();
        addRequestInterceptor(this.instance, serializeArrayParametersInterceptor);
        addResponseInterceptor(this.instance, logResponseInterceptor(this.logger));
    }

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
        console.log('🗒 rawData', rawData)
        if (rawData === "")
            return;

        await RNFS.writeFile(tempSyncDataFile, rawData, "utf8");

        try {
            const data =
                (await this.apiService.post<{ url: string; fields: Record<string, any>; taskId: string }>(`${ringApiBaseUrl}/sync`, {
                    ringId: ring.id,
                    firmware: ring.firmware,
                })).data;

            const formData = new FormData();
            Object.entries(data.fields).forEach(([k, v]) => {
                formData.append(k, v);
            });
            formData.append('Content-Type', "text/plain");
            formData.append("file", {
                uri: tempSyncDataFile,
                type: "text/plain",
                name: "sync.txt",
            });

            await this.instance.post(data.url, formData);

            let gotExceptionOnly = false;
            let task;
            let retry = true;
            for (let j = 0; j < 60 && retry; ++j) {
                gotExceptionOnly = true;
                for (let i = 0; i < 5; ++i) {
                    try {
                        task = (await this.apiService.get<Task>(`/tasks/${data.taskId}`)).data;
                        this.logger.info(task);
                        retry = isTaskRunning(task.status);
                        gotExceptionOnly = false;
                        i = 5;
                    } catch (e) {
                        gotExceptionOnly = true;
                        this.logger.error(e);
                    }
                }

                if (gotExceptionOnly) {
                    throw Error('Cannot sync');
                }

                await sleep(1000);
            }

            if (!task || task.status !== 'ENDED') {
                throw Error('Sync Task execution error');
            }
            // TODO Might add something on the UI depending on the task adv ?
        } finally {
            await RNFS.unlink(tempSyncDataFile);
        }
    }

    async submitFirmwareVersion(id: string, version: string):
        Promise<void> {
        const data = {
            "firmware": version
        }
        await this.apiService.put(`${ringApiBaseUrl}/${id}`, data);
    }
}

type PostUserRing = Omit<UserRing, "userId" | "lastSyncDate">;
