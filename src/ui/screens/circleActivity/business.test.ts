import { ActivityStage } from "@domain/measure/type";
import { colors } from "@ui/styles/colors";
import { getActivityIntensityBarColor } from "./business";

test("Spec 00024: bar colors", function () {
	expect(getActivityIntensityBarColor(ActivityStage.SEDENTARY)).toBe(colors.business.activityStageNone);
	expect(getActivityIntensityBarColor(ActivityStage.LOW)).toBe(colors.business.activityStageLow);
	expect(getActivityIntensityBarColor(ActivityStage.MEDIUM)).toBe(colors.business.activityStageMedium);
	expect(getActivityIntensityBarColor(ActivityStage.HIGH)).toBe(colors.business.activityStageHigh);
});
