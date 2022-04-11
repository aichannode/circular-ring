import { ApiService } from "@core/api/apiService";
import { getCurrentLocalISODay } from "@domain/common/business";
import { ISODay, ISOMonth } from "@domain/common/type";
import { toUTCTimeSegment } from "../../common/business";
import { DatedMetrics, Metrics, MetricType } from "../../metric";
import { TimeFrame } from "../../type";

function createBlock(timestamp: string): DatedMetrics {
	return {
		timestamp,
		metrics: {},
	};
}

const measureApiUrl = "/measures";
const latestMeasureApiUrl = "/measures/latest";
export class MeasureApi {
	constructor(private readonly apiService: ApiService) {}

	private async getMeasures<T extends MetricType>(
		metrics: ReadonlyArray<T>,
		{
			isoStart,
			isoEnd,
		}: {
			isoStart: string;
			isoEnd: string;
		},
		useForceRefresh?: boolean
	): Promise<Array<DatedMetrics<T>>> {
		const {
			data: { data },
		} = await this.apiService.get<{ data: DatedMetrics[] }>(measureApiUrl, {
			params: { metrics, start: isoStart, end: isoEnd },
			useForceRefresh,
		});
		if (data.length) {
			const chain: DatedMetrics[] = [];
			let currentTimestamp = data[0].timestamp;
			let block: DatedMetrics = createBlock(currentTimestamp);
			// Regroup metrics by timestamp
			for (const serverBlock of data) {
				// Need to create a new block
				if (currentTimestamp !== serverBlock.timestamp) {
					// Push the previous block
					chain.push(block);
					currentTimestamp = serverBlock.timestamp;
					// Create a new block
					block = createBlock(currentTimestamp);
				}
				Object.assign(block.metrics, serverBlock.metrics);
			}
			return chain;
		}
		return [];
	}

	private async getLastMeasures<T extends MetricType>(
		metrics: ReadonlyArray<T>,
		{
			isoStart,
			isoEnd,
		}: {
			isoStart: string;
			isoEnd: string;
		},
		useForceRefresh?: boolean
	): Promise<Partial<Metrics<T>>> {
		const result = await this.apiService.get<Partial<Metrics<T>>>(latestMeasureApiUrl, {
			params: { metrics, start: isoStart, end: isoEnd },
			useForceRefresh,
		});
		return result.data;
	}

	public async fetchMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoStart: string,
		isoEnd: string,
		useForceRefresh?: boolean
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, { isoStart, isoEnd }, useForceRefresh);
	}

	public async fetchLastDailyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoDay: ISODay,
		useForceRefresh?: boolean
	): Promise<Partial<Metrics<T>>> {
		return await this.getLastMeasures(measures, toUTCTimeSegment(isoDay, TimeFrame.DAY), useForceRefresh);
	}

	public async fetchDailyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoDay: ISODay,
		useForceRefresh?: boolean
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toUTCTimeSegment(isoDay, TimeFrame.DAY), useForceRefresh);
	}

	public async fetchLast7DaysMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoToday: ISODay = getCurrentLocalISODay(),
		useForceRefresh?: boolean
	): Promise<Partial<Metrics<T>>> {
		return await this.getLastMeasures(measures, toUTCTimeSegment(isoToday, TimeFrame.LAST_7_DAYS), useForceRefresh);
	}

	public async fetchWeeklyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoDay: ISODay,
		useForceRefresh?: boolean
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toUTCTimeSegment(isoDay, TimeFrame.WEEK), useForceRefresh);
	}

	public async fetchLast30DaysMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoToday: ISODay = getCurrentLocalISODay(),
		useForceRefresh?: boolean
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toUTCTimeSegment(isoToday, TimeFrame.LAST_30_DAYS), useForceRefresh);
	}

	public async fetchMonthlyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoMonth: ISOMonth,
		useForceRefresh?: boolean
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toUTCTimeSegment(isoMonth, TimeFrame.MONTH), useForceRefresh);
	}

	public async fetchLastMonthlyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoMonth: ISOMonth,
		useForceRefresh = false
	): Promise<Partial<Metrics<T>>> {
		return await this.getLastMeasures(measures, toUTCTimeSegment(isoMonth, TimeFrame.MONTH), useForceRefresh);
	}

	public async fetchLastAllMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoMonth: ISOMonth,
		useForceRefresh = false
	): Promise<Partial<Metrics<T>>> {
		return await this.getLastMeasures(measures, toUTCTimeSegment(isoMonth, TimeFrame.ALL), useForceRefresh);
	}
}
