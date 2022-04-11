export const RIGHT_ANGLE = 90;

export function angle(t: Date) {
	return ((t.getHours() + t.getMinutes() / 60) / 24) * 360;
}
export function toRad(angle: number) {
	return (angle / 360) * 2 * Math.PI;
}
