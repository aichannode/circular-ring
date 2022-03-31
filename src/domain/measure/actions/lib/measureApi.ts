import { ApiService } from "@core/api/apiService";
import { isToday } from "@domain/common/business";
import { ISODay, ISOMonth } from "@domain/common/type";
import moment from "moment";
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
		useForceRefresh = isToday(isoEnd, new Date().toISOString())
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
		useForceRefresh = isToday(isoEnd, new Date().toISOString())
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
		isoEnd: string
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, { isoStart, isoEnd });
	}

	public async fetchLastDailyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoDay: ISODay,
		useForceRefresh = false
	): Promise<Partial<Metrics<T>>> {
		return await this.getLastMeasures(measures, toUTCTimeSegment(isoDay, TimeFrame.DAY), useForceRefresh);
	}

	public async fetchDailyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoDay: ISODay
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toUTCTimeSegment(isoDay, TimeFrame.DAY));
	}

	public async fetchLast7DaysMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoToday: ISODay = moment().toISOString() as ISODay
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toUTCTimeSegment(isoToday, TimeFrame.LAST_7_DAYS));
	}

	public async fetchWeeklyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoDay: ISODay
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toUTCTimeSegment(isoDay, TimeFrame.WEEK));
	}

	public async fetchLast30DaysMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoToday: ISODay = moment().toISOString() as ISODay
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toUTCTimeSegment(isoToday, TimeFrame.LAST_30_DAYS));
	}

	public async fetchMonthlyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoMonth: ISOMonth
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toUTCTimeSegment(isoMonth, TimeFrame.MONTH));
	}
}
