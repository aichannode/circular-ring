import { DatedMetrics, MetricType } from "@domain/measure/metric";

export const isDefined = <T>(a: T | undefined): a is T => typeof a !== "undefined";
export const hasMetric =
	<T extends MetricType>(metricType: T) =>
	(block: DatedMetrics): block is DatedMetrics<MetricType.UserDailyActiveMinute> =>
		metricType in block.metrics;
