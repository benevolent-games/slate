
export type PipeFun<I, O> = (input: I) => O

export class Pipe<I> {

	static with<I>(input: I) {
		return new this(input)
	}

	#input: I

	constructor(input: I) {
		this.#input = input
	}

	to<O>(fun: PipeFun<I, O>) {
		return new Pipe(fun(this.#input))
	}

	done() {
		return this.#input
	}
}

