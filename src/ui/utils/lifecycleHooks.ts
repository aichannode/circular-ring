import { EffectCallback, useEffect, useRef } from "react";

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

export function useUnmount<T extends unknown[]>(effect: (deps: readonly [...T]) => void, deps: readonly [...T]): void {
	const depRefs = useRef(deps);
	useEffect(() => {
		depRefs.current = deps;
	}, deps);
	useEffect(() => () => effect(depRefs.current), []);
}
