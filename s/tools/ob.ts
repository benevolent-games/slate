
export namespace ob {

	export const map = <O extends {}, Value>(
			o: O,
			transform: (value: O[keyof O], key: keyof O) => Value,
		): {[P in keyof O]: Value} => (
		Object.fromEntries(Object.entries(o)
			.map(([key, value]: any) => [key, transform(value, key)]))
	)

	export const filter = <O extends {}>(
			o: O,
			judge: (value: O[keyof O], key: keyof O) => boolean,
		) => (
		Object.fromEntries(Object.entries(o)
			.filter(([key, value]: any) => judge(value, key))) as {[key: string]: O[keyof O]}
	)

	export namespace pipe {

		export const map = <O extends {}, Value>(
				transform: (value: O[keyof O], key: keyof O) => Value,
			) => (
			(o: O) => ob.map(o, transform)
		)

		export const filter = <O extends {}>(
				transform: (value: O[keyof O], key: keyof O) => boolean,
			) => (
			(o: O) => ob.filter(o, transform) as {[key: string]: O[keyof O]}
		)
	}
}

