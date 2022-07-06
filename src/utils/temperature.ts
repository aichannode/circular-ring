import { TemperatureVariation30Days, TemperatureVariation7D } from "@domain/measure/representation/api"

export const convertToF = (celsius: number) => {
	const fahrenheit = celsius * 9/5 + 32
	return Math.trunc(fahrenheit)
}
  

export const convertData = (data: TemperatureVariation7D | TemperatureVariation30Days, isCelcius: boolean) => {
	let newData = data?.series;
	if (!isCelcius) {
		newData?.forEach((element) => element?.value && (element.value = convertToF(element.value)));
	}
	return newData;
}
  