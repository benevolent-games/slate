
import {Bytes} from "../bytes.js"
import {prefixes} from "./utils/prefixes.js"
import {suffixes} from "./utils/suffixes.js"

const wordSeparator = "_"
const groupSeparator = " "
const defaultWordsPerGroup = 4

export const Barname = {
	random(byteCount: number) {
		return this.string(Bytes.random(byteCount))
	},

	string(bytes: Uint8Array, options?: {wordsPerGroup?: number}) {
		const groupSize = options?.wordsPerGroup ?? defaultWordsPerGroup

		const words: string[] = []
		let currentWord: string[] = []

		bytes.forEach((byte, index) => {
			const source = ((index % 2) === 0) ? prefixes : suffixes
			currentWord.push(source[byte]!)
			if (currentWord.length === 2) {
				words.push(currentWord.join(""))
				currentWord = []
			}
		})

		if (currentWord.length)
			words.push(currentWord.join(""))

		const grouped = []
		for (let i = 0; i < words.length; i += groupSize)
			grouped.push(words.slice(i, i + groupSize).join(wordSeparator))

		return grouped.join(groupSeparator)
	},

	bytes(string: string) {
		const letters = string
			.toLowerCase()
			.replace(/[^a-z]/g, "") // strip everything except letters

		const count = letters.length / 3
		if ((count % 1) !== 0)
			throw new Error(`invalid triplet count, ${letters.length} does not divide into triplets`)

		const triplets: string[] = []
		for (let i = 0; i < letters.length; i += 3)
			triplets.push(letters.slice(i, i + 3))

		return new Uint8Array(triplets.map((triplet, index) => {
			const source = ((index % 2) === 0) ? prefixes : suffixes
			const number = source.findIndex(t => t === triplet)
			if (number === -1)
				throw new Error(`unknown triplet ${triplet}`)
			return number
		}))
	},
}

