
import {Nibbles} from "./nibbles.js"
import {RuneDictionary} from "./dictionary.js"

export class RuneDecoder {
	constructor(public dictionary: RuneDictionary) {}

	bytes(string: string) {
		const {pattern, phrasing} = this.dictionary
		const characters = [...string.trim().replace(/\s+/gim, "")]
		const flatpattern = pattern.flat()
		const nibbles: number[] = []

		while (characters.length) {
			const phraseKey = flatpattern[nibbles.length % flatpattern.length]
			const phrases = phrasing[phraseKey]
			const phrase = characters.splice(0, phrases.phraseLength).join("")
			const nibble = phrases.nibble(phrase)
			nibbles.push(nibble)
		}

		if ((nibbles.length % 2) !== 0)
			throw new Error("odd number of nibbles (should be even)")

		const bytes: number[] = []

		for (let i = 0; i < nibbles.length; i += 2) {
			const nibbleA = nibbles[i]
			const nibbleB = nibbles[i + 1]
			bytes.push(Nibbles.merge(nibbleA, nibbleB))
		}

		return new Uint8Array(bytes)
	}
}

