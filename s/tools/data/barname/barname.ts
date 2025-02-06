
import {Bytes} from "../bytes.js"
import {prefixes} from "./utils/prefixes.js"
import {suffixes} from "./utils/suffixes.js"

const separator = "_"

export const Barname = {
	random(byteCount: number) {
		return this.string(Bytes.random(byteCount))
	},

	string(bytes: Uint8Array) {
		const words: string[] = []
		let currentWord: string[] = []

		bytes.forEach((byte, index) => {
			const source = ((index % 2) === 0)
				? prefixes
				: suffixes

			currentWord.push(source[byte]!)

			if (currentWord.length === 2) {
				words.push(currentWord.join(""))
				currentWord = []
			}
		})

		if (currentWord.length)
			words.push(currentWord.join(""))

		return words.join(separator)
	},

	bytes(string: string) {
		const letters = string
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "")
			.replaceAll("_", "")

		const count = letters.length / 3
		if ((count % 1) !== 0)
			throw new Error(`invalid triplet count, ${letters.length} does not divide into triplets`)

		const triplets: string[] = []
		for (const index of Array(count).keys()) {
			const i = index * 3
			triplets.push(letters[i] + letters[i + 1] + letters[i + 2])
		}

		return new Uint8Array(triplets.map((triplet, index) => {
			const source = ((index % 2) === 0)
				? prefixes
				: suffixes
			const number = source.findIndex(t => t === triplet)
			if (number === -1)
				throw new Error(`unknown triplet ${triplet}`)
			return number
		}))
	},
}

