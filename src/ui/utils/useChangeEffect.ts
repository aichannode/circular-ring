import { EffectCallback, useRef, useEffect } from "react";

export function useChangeEffect(effect: EffectCallback, deps?: unknown[]): void {
	const firstRender = useRef(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
		} else {
			return effect();
		}
	}, deps);
}
