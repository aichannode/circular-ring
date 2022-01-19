/* import { ApiService } from "@core/api/apiService"; */
import moment from "moment";
import { toTimeSegment } from "../../common/business";
import { MetricType, DatedMetrics, Metric } from "../../metric";
import mockedData from "../../mockedData.json";
import { TimeFrame } from "../../type";

//const measureApiUrl = "/measures";

// Parse data for performance reason
/* const mockedData = {
	..._mockedData,
	metrics: _mockedData.metrics.map(block => ({
		...block,
		timestamp: new Date(block.timestamp).getTime()
	}))
} */

function createBlock(date: number): DatedMetrics {
	return {
		timestamp: new Date(date).toISOString(),
		metrics: {},
	};
}

// const measureApiUrl = "/measures";
// const latestMeasureApiUrl = "/measures/latest";
export class MeasureApi {
	//constructor(private readonly apiService: ApiService) {}

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
		/* 		const result = await this.apiService.get<{ data: MetricInfo<T>[] }>(measureApiUrl, {
			params: { metrics, start: start.toISOString(), end: end.toISOString() },
		});
		return result.data.data; */

		const start = new Date(isoStart).getTime();
		const end = new Date(isoEnd).getTime();
		const chain: DatedMetrics[] = [];
		let currentTimestamp = mockedData.metrics[0].timestamp;
		let block: DatedMetrics = createBlock(currentTimestamp);
		// Regroup metrics by timestamp
		for (const serverBlock of mockedData.metrics) {
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

		// Get the data within the given timeframe
		return await chain.filter(function (block) {
			const { timestamp } = block;
			const timestampMS = new Date(timestamp).getTime();
			const isInDate = timestampMS >= start && timestampMS < end;
			const hasMetric = metrics.some((key) => key in block.metrics);
			return isInDate && hasMetric;
		});
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
	): Promise<Record<T, number | string>> {
		/* const result = await this.apiService.get<Record<Metric, number>>(latestMeasureApiUrl, {
			params: { metrics, start: start.toISOString(), end: end.toISOString() }
		}) */

		const start = new Date(isoStart).getTime();
		const end = new Date(isoEnd).getTime();
		const checkList = [...metrics];
		return await mockedData.metrics.reduceRight(function (record, block) {
			const timestamp = new Date(block.timestamp).getTime();
			if (timestamp >= start && timestamp < end) {
				for (const metric of checkList) {
					if (metric in block.metrics) {
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						record[metric] = block.metrics[metric]!;
					}
				}
			}
			return record;
		}, {} as Record<T, number | string>);
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
	): Promise<Metric<T>> {
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
