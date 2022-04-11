import { DatedMetrics, MetricType } from "@domain/measure/metric";

export const hasMetric =
	<T extends MetricType>(metricType: T) =>
	(block: DatedMetrics): block is DatedMetrics<MetricType.UserDailyActiveMinute> =>
		metricType in block.metrics;
