import { TemperatureVariation30Days, TemperatureVariation7D } from "@domain/measure/representation/api";

export const convertToF = (celsius: number) => {
	if (celsius === -1000) return -1000;
	const fahrenheit = Math.trunc(celsius * 1.8 * 100) / 100;
	return fahrenheit;
};

export const convertData = (data: TemperatureVariation7D | TemperatureVariation30Days, isCelcius: boolean) => {
	const newData = data?.series;
	if (!isCelcius) {
		newData?.forEach((element) => element?.value && (element.value = convertToF(element.value)));
	}
	return newData;
};
