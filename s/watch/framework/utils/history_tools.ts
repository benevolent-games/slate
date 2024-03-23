
import {Annals} from "./annals.js"

export function trim_to_history_limit<X>(array: X[], limit: number) {
	while (array.length > limit)
		array.shift()
	return array
}

export function record_snapshot(history: Annals<any>, state: any, limit: number) {
	history.snapshots.push(structuredClone(state))
	trim_to_history_limit(history.snapshots, limit)
}

