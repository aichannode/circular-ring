import { isToday } from "@domain/feed/business";

/**
 * Return either we can display the data of this day or not
 * @implements spec [00000](https://docs.google.com/document/d/16SRBS_XPqDhePKuCi6rQm399n72H_82GTPAiay6AQlQ/edit?disco=AAAAWIm9aec)
 */
export function canDisplay(isoDay: string, userCoreSleepEnd: number) {
	return isToday(new Date(userCoreSleepEnd).toISOString(), isoDay);
}
