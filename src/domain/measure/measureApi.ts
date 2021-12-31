import { ApiService } from "@core/api/apiService";
import { Metric, MetricInfo } from "./metric";

const measureApiUrl = "/measures";
const latestMeasureApiUrl = "/measures/latest";
export class MeasureApi {
	constructor(private readonly apiService: ApiService) {}

	async getMeasures<T extends Metric>(metrics: T[], start: Date, end: Date): Promise<MetricInfo<T>[]> {
		const result = await this.apiService.get<{ data: MetricInfo<T>[] }>(measureApiUrl, {
			params: { metrics, start: start.toISOString(), end: end.toISOString() },
		});
		return result.data.data;
	}

	async getLastMeasures(metrics: Metric[], start: Date, end: Date) {
		const result = await this.apiService.get<Record<Metric, number>>(latestMeasureApiUrl, {
			params: { metrics, start: start.toISOString(), end: end.toISOString() }
		})
		return result.data;
	}
}
