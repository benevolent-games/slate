
export class FlatstateError extends Error {
	name = this.constructor.name
}

export class CircularFlatstateError extends FlatstateError {
	constructor(key: string) {
		super(`forbidden circularity, rejected assignment to "${key}"`)
	}
}

export class ReadonlyError extends FlatstateError {
	constructor(key: string) {
		super(`forbidden assignment to readonly property "${key}"`)
	}
}

