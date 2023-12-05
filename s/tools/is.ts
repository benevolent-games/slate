
export const is = {

	object: <X>(x: X): x is NonNullable<X> & object =>
		typeof x === "object" && x !== null,

	array: (x: any | any[]): x is any[] =>
		Array.isArray(x),

	defined: <X>(x: X): x is NonNullable<X> =>
		x !== undefined && x !== null,
}

