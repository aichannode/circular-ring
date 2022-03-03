import { linspace, progress } from "./business";

test("should return an evenly spaced array of points (asc)", function () {
	expect(linspace(0, 10, 5)).toEqual([0, 2.5, 5, 7.5, 10]);
	expect(linspace(0, 10, 2)).toEqual([0, 10]);
	expect(linspace(0, 10, 1)).toEqual([0]);
	expect(linspace(0, 10, 0)).toEqual([]);
	expect(linspace(0, 10, -10)).toEqual([]);
});

test("should return an evenly spaced array of points (same bound)", function () {
	expect(linspace(0, 0, 3)).toEqual([0, 0, 0]);
	expect(linspace(10, 10, 1)).toEqual([10]);
});

test("should return an evenly spaced array of points (desc)", function () {
	expect(linspace(10, 0, 5)).toEqual([10, 7.5, 5, 2.5, 0]);
	expect(linspace(10, 0, 2)).toEqual([10, 0]);
	expect(linspace(10, 0, 1)).toEqual([10]);
	expect(linspace(10, 0, 0)).toEqual([]);
});

test("should return valid progress", function () {
	expect(progress(0, 0, 1)).toEqual(0);
	expect(progress(0.5, 0, 1)).toEqual(0.5);
	expect(progress(12.5, 10, 20)).toEqual(0.25);
});
