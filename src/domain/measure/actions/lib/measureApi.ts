import { ApiService } from "@core/api/apiService";
import moment from "moment";
import { toTimeSegment } from "../../common/business";
import { MetricType, DatedMetrics, Metrics } from "../../metric";
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
		}
	): Promise<Array<DatedMetrics<T>>> {
		const {
			data: { data },
		} = await this.apiService.get<{ data: DatedMetrics[] }>(measureApiUrl, {
			params: { metrics, start: isoStart, end: isoEnd },
		});

		const chain: DatedMetrics[] = [];
		let currentTimestamp = data[0].timestamp;
		let block: DatedMetrics = createBlock(currentTimestamp);
		// Regroup metrics by timestamp
		for (const serverBlock of data) {
			// Need to create a new block
			if (currentTimestamp !== serverBlock.timestamp) {
				// Push the previous block
				chain.unshift(block);
				currentTimestamp = serverBlock.timestamp;
				// Create a new block
				block = createBlock(currentTimestamp);
			}
			Object.assign(block.metrics, serverBlock.metrics);
		}
		return chain;
	}

	private async getLastMeasures<T extends MetricType>(
		metrics: ReadonlyArray<T>,
		{
			isoStart,
			isoEnd,
		}: {
			isoStart: string;
			isoEnd: string;
		}
	): Promise<Partial<Metrics<T>>> {
		const result = await this.apiService.get<Partial<Metrics<T>>>(latestMeasureApiUrl, {
			params: { metrics, start: isoStart, end: isoEnd },
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
		isoDay: string
	): Promise<Partial<Metrics<T>>> {
		return await this.getLastMeasures(measures, toTimeSegment(isoDay, TimeFrame.DAY));
	}

	public async fetchTodayMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoToday: string = moment().toISOString()
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toTimeSegment(isoToday, TimeFrame.TODAY));
	}

	public async fetchDailyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoDay: string
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toTimeSegment(isoDay, TimeFrame.DAY));
	}

	public async fetchLast7DaysMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoToday: string = moment().toISOString()
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toTimeSegment(isoToday, TimeFrame.LAST_7_DAYS));
	}

	public async fetchWeeklyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoWeek: string
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toTimeSegment(isoWeek, TimeFrame.WEEK));
	}

	public async fetchLast30DaysMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoToday: string = moment().toISOString()
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toTimeSegment(isoToday, TimeFrame.LAST_30_DAYS));
	}

	public async fetchMonthlyMeasures<T extends MetricType>(
		measures: ReadonlyArray<T>,
		isoMonth: string
	): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toTimeSegment(isoMonth, TimeFrame.MONTH));
	}

	public async fetchAllMeasures<T extends MetricType>(measures: ReadonlyArray<T>): Promise<Array<DatedMetrics<T>>> {
		return await this.getMeasures(measures, toTimeSegment("", TimeFrame.ALL));
	}
}
