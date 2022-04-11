/**
 * Linear interpolation function factory.
 * Returns a lerp function calibrated for the given input output amplitude
 * @param from the original Y amplitude [minY, maxY]
 * @param to the projected Y amplitude [minY, maxY]
 */
export function lerp(from: [number, number], to: [number, number]) {
	const a = (to[1] - to[0]) / (from[1] - from[0]);
	const b = to[0];
	return (x: number) => a * x + b;
}
