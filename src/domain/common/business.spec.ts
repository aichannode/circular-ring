import { isYesterday } from "./utils";

const today = "2021-10-12T14:31:06.585Z";

it("should not be a yesterday date", function () {
	expect(isYesterday("2021-10-09T10:31:06.585Z", today)).toBeFalsy();
});

it("should be a yesterday date", function () {
	expect(isYesterday("2021-10-11T14:31:06.585Z", today)).toBeTruthy();
});
