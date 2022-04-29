import { isDefined } from "@domain/common/business";
import { DatedMetrics, Metrics, MetricType } from "@domain/measure/metric";

/** Return true if the given metric name is present in the */
export const hasMetric =
	<M extends MetricType>(metricType: M) =>
	(data: DatedMetrics<any> | Metrics<any>): data is typeof data extends any[] ? DatedMetrics<M> : Metrics<M> => {
		return isDefined(data["metrics"]) ? Boolean(data.metrics?.[metricType] !== null) : data[metricType] !== null;
	};
