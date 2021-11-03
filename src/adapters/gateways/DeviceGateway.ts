export interface DeviceGateway {
	getAvailableDevices(): Promise<string[]>;
	disableDevice(deviceId : string): void;
    enableDevice(deviceId : string): void;
}