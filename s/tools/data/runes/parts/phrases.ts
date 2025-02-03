
import {Map2} from "../../../map2.js"

const requiredPhraseCount = 16

export class Phrases {
	readonly phraseLength: number
	#phrases = new Map2<number, string>()
	#nibbles = new Map2<string, number>()

	constructor(originalStrings: string[]) {
		const set = new Set<string>()

		for (const string of originalStrings) {
			if (set.has(string))
				throw new Error(`duplicate phrase "${string}"`)
			set.add(string)
		}

		const strings = [...set]

		if (strings.length !== requiredPhraseCount)
			throw new Error(`invalid phrase count`)

		const [firstPhrase] = strings
		this.phraseLength = firstPhrase.length

		for (const phrase of strings)
			if (phrase.length !== this.phraseLength)
				throw new Error(`invalid phrase length "${phrase}"`)

		strings.forEach((phrase, codepoint) => {
			this.#phrases.set(codepoint, phrase)
			this.#nibbles.set(phrase, codepoint)
		})
	}

	phrase(nibble: number) {
		return this.#phrases.require(nibble)
	}

	nibble(phrase: string) {
		return this.#nibbles.require(phrase)
	}
}

