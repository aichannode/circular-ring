import { lerp } from "./business";

test("lerp", function () {
	expect(lerp([0, 100], [-100, 100])(50)).toBe(0);
	expect(lerp([0, 100], [-100, 100])(100)).toBe(100);
});
