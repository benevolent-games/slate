
export function repeat(milliseconds: number, fn: () => Promise<void>) {
	let active = true

	const execute = async() => {
		if (active) {
			await fn()
			setTimeout(() => execute(), milliseconds)
		}
	}

	execute()

	return () => { active = false }
}

repeat.hz = (hertz: number, fn: () => Promise<void>) => repeat(1000 / hertz, fn)

/////////////////////////////////////////////////////

/** @deprecated use `repeat` instead */
export class Repeater {
	active = true

	constructor(public milliseconds: number, public fn: () => Promise<void>) {
		this.execute()
	}

	async execute() {
		if (this.active === true) {
			await this.fn()
			setTimeout(() => this.execute(), this.milliseconds)
		}
	}

	stop() {
		this.active = false
	}
}

/** @deprecated use `repeat` instead */
export function repeater(milliseconds: number, fn: () => Promise<void>) {
	return new Repeater(milliseconds, fn)
}

/** @deprecated use `repeat.hz` instead */
repeater.hz = (hertz: number, fn: () => Promise<void>) => repeater(1000 / hertz, fn)

