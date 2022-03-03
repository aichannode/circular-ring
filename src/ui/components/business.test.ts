import { lerp } from "./business";

test("lerp", function () {
	expect(lerp(2, -100)(50)).toBe(0);
	expect(lerp(2, -100)(100)).toBe(100);
});
