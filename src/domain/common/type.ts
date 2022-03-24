// Helpers for handling date (valid until 2099)
type d = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;
type toTwelve = "00" | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12";
type YYYY = `19${d}${d}` | `20${d}${d}`;
type toFive = 0 | 1 | 2 | 3 | 4 | 5;
type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
type DD = `${0}${oneToNine}` | `${1 | 2}${d}` | `3${0 | 1}`;
export type ISOMonth = `${YYYY}-${MM}`;
export type ISODay = `${ISOMonth}-${DD}`;
export type ISODate = ISOMonth | ISODay;
export type TZ = `+${toTwelve}:${toFive}${d}` | `-${toTwelve}:${toFive}${d}`;
