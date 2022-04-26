import { MetricType } from "@domain/measure/metric";
import { sanitize } from "./business";

test("sanitize", function () {
	expect(
		sanitize({ [MetricType.UserCoreSleepBegin]: 0 }, [MetricType.UserCoreSleepBegin, MetricType.UserCoreSleepEnd])
	).toEqual({
		[MetricType.UserCoreSleepBegin]: 0,
		[MetricType.UserCoreSleepEnd]: null,
	});
});
