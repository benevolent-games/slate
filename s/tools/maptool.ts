
export type MapSubset<K, V> = {
	has(key: K): boolean
	get(key: K): V | undefined
	set(key: K, value: V): void
}

export function maptool<K, V>(map: MapSubset<K, V>) {
	return new MapTool<K, V>(map)
}

export class MapTool<K, V> {
	constructor(public readonly map: MapSubset<K, V>) {}

	grab(key: K, make: () => V) {
		const {map} = this
		if (map.has(key))
			return map.get(key)!
		else {
			const value = make()
			map.set(key, value)
			return value
		}
	}
}

