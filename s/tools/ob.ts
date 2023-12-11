
export function ob<Ob extends object>(o: Ob) {
	return {
		map: <Value>(transform: ObTransform<Ob, Value>) => (
			obMap(o, transform)
		),
		filter: (predicate: ObPredicate<Ob>) => (
			obFilter(o, predicate)
		),
	}
}

////////////
////////////

ob.pipe = Object.freeze({
	map: <O extends {}, Value>(
			transform: (value: O[keyof O], key: keyof O) => Value,
		) => (
		(o: O) => obMap(o, transform)
	),
	filter: <O extends {}>(
			transform: (value: O[keyof O], key: keyof O) => boolean,
		) => (
		(o: O) => obFilter(o, transform) as {[key: string]: O[keyof O]}
	),
})

////////////
////////////

export type ObTransform<Ob extends object, Value> = (
	(value: Ob[keyof Ob], key: keyof Ob) => Value
)

export type ObPredicate<Ob extends object> = (
	(value: Ob[keyof Ob], key: keyof Ob) => boolean
)

////////////
////////////

const obMap = <Ob extends object, Value>(
		o: Ob,
		transform: ObTransform<Ob, Value>,
	) => {

	return Object.fromEntries(
		Object.entries(o).map(
			([key, value]: any) => [key, transform(value, key)]
		)
	) as {[P in keyof Ob]: Value}
}

const obFilter = <Ob extends object>(
		o: Ob,
		predicate: ObPredicate<Ob>,
	) => {

	return Object.fromEntries(
		Object.entries(o).filter(
			([key, value]: any) => predicate(value, key)
		)
	) as {[P in keyof Ob]?: Ob[keyof Ob]}
}

