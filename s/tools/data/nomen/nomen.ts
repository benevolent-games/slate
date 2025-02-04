
import {Bytes} from "../bytes.js"
import {Dictionary, Pattern} from "./types.js"

export class Nomen<D extends Dictionary> {
	constructor(public dictionary: D, public patterns: Pattern<D>[]) {}

	static dictionary = <D extends Dictionary>(dictionary: D) => ({
		patterns: (patterns: Pattern<D>[]) => (
			new this<D>(dictionary, patterns)
		),
	})

	generate([firstByte, ...bytes]: Uint8Array) {
		const pattern = this.patterns[firstByte % this.patterns.length]
		let index = 0

		const obtainWordChunk = (key: keyof D) => {
			const dictionary = this.dictionary[key]
			const byte = bytes[(index++) % bytes.length]
			return dictionary[byte % dictionary.length]
		}

		return pattern
			.map(wordpattern => wordpattern.map(obtainWordChunk).join(""))
			.join(" ")
	}

	random() {
		const buffer = Bytes.random(32)
		return this.generate(buffer)
	}
}

