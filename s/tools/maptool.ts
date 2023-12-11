
export type MapSubset<K, V> = {
	has(key: K): boolean
	get(key: K): V | undefined
	set(key: K, value: V): void
}

export function maptool<K, V>(map: MapSubset<K, V>) {
	return {
		guarantee: (key: K, make: () => V) => (
			mapGuarantee(map, key, make)
		),
	}
}

function mapGuarantee<K, V>(
		map: MapSubset<K, V>,
		key: K,
		make: () => V,
	) {

	if (map.has(key))
		return map.get(key)!
	else {
		const value = make()
		map.set(key, value)
		return value
	}
}

