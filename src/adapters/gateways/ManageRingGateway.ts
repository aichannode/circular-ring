import { Storage } from "@core/storage";
import { DeviceGateway } from "./DeviceGateway";
const deviceManagementStorageKey = "@deviceManagementStorageKey";

export class ManageRingGateway implements DeviceGateway {
    async getAvailableDevices(): Promise<string[]> {
        const devices = await Storage.load<string[]>(deviceManagementStorageKey)
        if (devices){
            return  Promise.resolve(devices)
        }
        return Promise.resolve([])
    }
    async disableDevice(deviceId: string): Promise<void> {
        const devices = await Storage.load<string[]>(deviceManagementStorageKey)
        if (devices){
            if( !devices.includes(deviceId)){
               devices.push(deviceId)
               Storage.save<string[]>(deviceManagementStorageKey, devices)
            }  
        }else{
            Storage.save<string[]>(deviceManagementStorageKey, [deviceId])
        }
     }
    async enableDevice(deviceId: string): Promise<void> {
        const devices = await Storage.load<string[]>(deviceManagementStorageKey)
        if (devices){
            if( devices.includes(deviceId)){
                const newDevices = devices.filter(obj => obj !== deviceId);
               Storage.save<string[]>(deviceManagementStorageKey, newDevices)
            }  
        } 
    }

}
