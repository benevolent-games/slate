
/*

represent arbitrary bytes as human readable names, looks like:

	Xotemu Jaycifmur
	Oleoti Eweuhipag
	Tinewe Uyoaluafi

every three letters is a syllable, which represents one byte.

*/

import {Bytes} from "./bytes.js"
import {syllables} from "./utils/syllables.js"

const dictionary = syllables.combo
const defaultPattern = "Xxxxxx Xxxxxxxxx "

export const Bytename = {
	dictionary,

	string(bytes: Uint8Array, pattern = defaultPattern) {
		if (pattern.indexOf("x") === -1)
			throw new Error("invalid pattern")

		const parts: string[] = []
		for (const byte of bytes)
			parts.push(dictionary.at(byte)!)

		const composite = [...parts.join("")].toReversed()
		const letters: string[] = []
		let patternIndex = 0

		while (composite.length > 0) {
			const glyph = pattern.at(patternIndex % pattern.length)!
			letters.push(
				glyph === "x" ?
					composite.pop()! :
				glyph === "X" ?
					composite.pop()!.toUpperCase() :
					glyph
			)
			patternIndex++
		}

		return letters.join("")
	},

	bytes(string: string) {
		const letters = string.toLowerCase().trim().replace(/\s+/g, "")
		const count = letters.length / 3
		if ((count % 1) !== 0)
			throw new Error(`invalid triplet count, ${letters.length} does not divide into triplets`)

		const triplets: string[] = []
		for (const index of Array(count).keys()) {
			const i = index * 3
			triplets.push(letters[i] + letters[i + 1] + letters[i + 2])
		}

		return new Uint8Array(triplets.map(triplet => {
			const number = dictionary.findIndex(t => t === triplet)
			if (number === -1)
				throw new Error(`unknown triplet ${triplet}`)
			return number
		}))
	},

	equal(name1: string, name2: string) {
		const re1 = this.string(this.bytes(name1), "x")
		const re2 = this.string(this.bytes(name2), "x")
		return re1 === re2
	},

	/** generate a random bytename. byteCount defaults to 5. */
	random(byteCount = 5, pattern = defaultPattern) {
		return this.string(Bytes.random(byteCount), pattern)
	},
}

