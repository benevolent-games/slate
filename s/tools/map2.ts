
export class Map2<K, V> extends Map<K, V> {
	static require<K, V>(map: Map<K, V>, key: K) {
		const value = map.get(key)
		if (value === undefined)
			throw new Error(`required key not found: "${key}"`)
		return value
	}

	static guarantee<K, V>(map: Map<K, V>, key: K, make: () => V) {
		let value = map.get(key)

		if (value === undefined) {
			value = make()
			map.set(key, value)
		}

		return value
	}

	array() {
		return [...this]
	}

	require(key: K) {
		return Map2.require(this, key)
	}

	guarantee(key: K, make: () => V) {
		return Map2.guarantee(this, key, make)
	}
}

export type Identifiable<Id = any> = {id: Id}

export class Pool<V extends Identifiable> extends Map2<V["id"], V> {
	got(value: V) {
		return this.has(value.id)
	}

	add(value: V) {
		this.set(value.id, value)
		return value
	}

	remove(value: V) {
		return this.delete(value.id)
	}
}

