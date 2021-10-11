import { ApiService } from "@core/api/apiService";
import { Metric, MetricInfo } from "./metric";

const measureApiUrl = "/measures";
export class MeasureApi {
	constructor(private readonly apiService: ApiService) {}

	async getMeasures<T extends Metric>(metrics: T[], start: Date, end: Date): Promise<MetricInfo<T>[]> {
		const result = await this.apiService.get<{ data: MetricInfo<T>[] }>(measureApiUrl, {
			params: { metrics, start: start.toISOString(), end: end.toISOString() },
		});
		return result.data.data;
	}
}
