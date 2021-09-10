import { useMemo } from "react";
import { getLogger } from "../logger";

export function useLogger(sender: string) {
	return useMemo(() => getLogger(sender), [sender]);
}
