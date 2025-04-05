
/** @deprecated use `MapG` instead */
export type MapBase<K, V> = {
	has(key: K): boolean
	get(key: K): V | undefined
	set(key: K, value: V): void
}

/** @deprecated use `MapG` instead */
export function maptool<K, V>(map: MapBase<K, V>) {
	return {
		guarantee: (key: K, make: () => V) => (
			mapGuarantee(map, key, make)
		),
	}
}

/** @deprecated use `MapG` instead */
export function mapGuarantee<K, V>(
		map: MapBase<K, V>,
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

