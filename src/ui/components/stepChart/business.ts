/**
 * Returns num evenly spaced samples, calculated over the interval [start, stop].
 *
 * @param start The starting value of the sequence.
 * @param stop The end value of the sequence.
 * @param n Number of samples to generate. Must be non-negative.
 * @returns There are num equally spaced samples in the closed interval [start, stop]
 */
export function linspace(start: number, stop: number, n: number): number[] {
	const result: number[] = [];
	const step = (stop - start) / Math.max(1, n - 1);

	for (let i = 0; i < n; i++) {
		result.push(start + i * step);
	}

	return result;
}

/**
 * Convert a progress value inside a range [min, max] to a percentage.
 *
 * @param value Value to convert.
 * @param min Lower bound of the range.
 * @param max Upper bound of the range.
 * @returns Percentage value.
 */
export function progress(value: number, min: number, max: number): number {
	return (value - min) / Math.max(1, max - min);
}
