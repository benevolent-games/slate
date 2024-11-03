
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

export function repeater(milliseconds: number, fn: () => Promise<void>) {
	return new Repeater(milliseconds, fn)
}

repeater.hz = (hertz: number, fn: () => Promise<void>) => repeater(1000 / hertz, fn)

