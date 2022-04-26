import { isDefined } from "@domain/common/business";
import { Metrics, MetricType } from "@domain/measure/metric";

/**
 * Convert server data on something acceptable by the model.
 * Put here all the general data transformations.
 */
export function sanitize<M extends MetricType>(
	dto: Record<string, string | number | null>,
	metrics: ReadonlyArray<M>
): Metrics<M> {
	const obj = { ...dto };
	for (const key of metrics) {
		if (!isDefined(obj[key])) {
			obj[key] = null;
		}
	}
	return obj as Metrics<M>;
}
