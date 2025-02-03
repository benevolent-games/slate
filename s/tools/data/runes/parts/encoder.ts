
import {Nibbles} from "./nibbles.js"
import {RuneDictionary} from "./dictionary.js"

export class RuneEncoder {
	constructor(public dictionary: RuneDictionary) {}

	string(bytes: Uint8Array) {
		const {pattern, phrasing} = this.dictionary
		const nibbles = Nibbles.split(...bytes)
		const words: string[] = []

		let wordparts: string[] = []

		for (const nibble of nibbles) {
			const wordpattern = pattern[words.length % pattern.length]
			const phrasekey = wordpattern[wordparts.length % wordpattern.length]
			const phrases = phrasing[phrasekey]
			const phrase = phrases.phrase(nibble)

			wordparts.push(phrase)

			if (wordparts.length === wordpattern.length) {
				words.push(wordparts.join(""))
				wordparts = []
			}
		}

		return words.join(" ")
	}
}

