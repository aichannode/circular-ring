import { ApiService } from "@core/api/apiService";
import moment from "moment";
import { MetricType, DatedMetrics, Metric } from "./metric";
import _mockedData from "./mockedSleepDurationData.json"
import { MetricDto } from "./type";

const measureApiUrl = "/measures";

const mockedData: MetricDto = _mockedData

function createBlock(date: string): DatedMetrics {
	return {
		timestamp: mockedData.metrics[0].timestamp,
		metrics: {}
	}
}

export class MeasureApi {
	constructor(private readonly apiService: ApiService) {}

	async getMeasures<T extends MetricType>(metrics: ReadonlyArray<T>, start: Date, end: Date): Promise<Array<DatedMetrics<T>>> {
/* 		const result = await this.apiService.get<{ data: MetricInfo<T>[] }>(measureApiUrl, {
			params: { metrics, start: start.toISOString(), end: end.toISOString() },
		});
		return result.data.data; */

		const chain: DatedMetrics[] = []
		let currentTimestamp = mockedData.metrics[0].timestamp
		let block: DatedMetrics = createBlock(currentTimestamp)
		// Regroup metrics by timestamp
		for (const serverBlock of mockedData.metrics) {
			// Inject some missing data at the date of the write of this function

			serverBlock.metrics[MetricType.UserDailyTotalActivity ] = 90 * 3600 * 1000, // 1h30 of activity
			serverBlock.metrics[MetricType.UserDailyTotalSleepDuration] = 8 * 3600 * 1000 // 8h00 of sleep
			serverBlock.metrics[MetricType.UserDailyEnergyScore] = 10

			// Need to create a new block
			if (currentTimestamp !== serverBlock.timestamp) {
				// Push the previous block
				chain.push(block)
				currentTimestamp = serverBlock.timestamp
				// Create a new block
				block = createBlock(currentTimestamp)
			}
			Object.assign(block.metrics, serverBlock.metrics)
		}

		// Get the data within the given timeframe 
		return await chain.filter(({timestamp}) => moment(timestamp)
				.isBetween(moment(start), moment(end)
		))
	}
}
