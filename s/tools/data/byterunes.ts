
import {Bytes} from "./bytes.js"
import {syllables} from "./utils/syllables.js"

const standardPrefixes = [
	"Ael",
	"Ang",
	"Eil",
	"Cha",
	"Esk",
	"Gal",
	"Dal",
	"Tho",
	"Tir",
	"Vel",
	"Fen",
	"Fal",
	"Nyl",
	"Mor",
	"Nor",
	"Lom",
]

const standardSuffixes = [
	"il",
	"lo",
	"le",
	"sk",
	"ar",
	"or",
	"yn",
	"vn",
	"by",
	"cy",
	"gy",
	"ky",
	"ly",
	"th",
	"vy",
	"ny",
]

const standardTriplets = syllables.oxo

export class Byterunes {
	static standard = new Byterunes()

	prefixes: string[]
	suffixes: string[]
	triplets: string[]

	static validate(label: string, dictionary: string[], charlength: number, phrasecount: number) {
		dictionary = [...new Set(dictionary)]
		if (dictionary.length !== phrasecount)
			throw new Error(`byterunes invalid ${label} dictionary length, got ${dictionary.length} where ${phrasecount} must be provided`)
		for (const phrase of dictionary) {
			if (phrase.length !== charlength)
				throw new Error(`byterunes invalid ${label} dictionary entry, "${phrase}" is the wrong length ${phrase.length} where ${charlength} is required`)
		}
		return dictionary
	}

	constructor(options: {
			triplets?: string[]
			prefixes?: string[]
			suffixes?: string[]
		} = {}) {

		this.triplets = Byterunes.validate("triplets", options.triplets ?? standardTriplets, 3, 256)
		this.prefixes = Byterunes.validate("prefixes", options.prefixes ?? standardPrefixes, 3, 16)
		this.suffixes = Byterunes.validate("suffixes", options.suffixes ?? standardSuffixes, 2, 16)
	}

	string(bytes: Uint8Array) {
		const byteGroups = this.#organizeByteGroups(bytes)
		const words: string[] = []

		for (const group of byteGroups)
			words.push(this.#generateWord(group))

		return words.join(" ")
	}

	random(byteCount = 5) {
		return this.string(Bytes.random(byteCount))
	}

	#nibbles(byte: number) {
		const high = (byte >> 4) & 0x0F
		const low = byte & 0x0F
		return [high, low] as [number, number]
	}

	#capitalize(name: string) {
		const [first, ...rest] = name
		return [first.toUpperCase(), ...rest].join("")
	}

	#generateWord([firstByte, ...moreBytes]: number[]) {
		const [prefixNibble, suffixNibble] = this.#nibbles(firstByte)
		const middleTriplets = moreBytes.map(byte => this.triplets.at(byte)!)
		const parts = [this.prefixes.at(prefixNibble)!, ...middleTriplets, this.suffixes.at(suffixNibble)!]
		return this.#capitalize(parts.join(""))
	}

	#organizeByteGroups(bytes: Uint8Array) {
		const pattern = [1, 2, 2]
		const byteGroups: number[][] = []
		let group: number[] = []

		for (const byte of bytes) {
			group.push(byte)

			const max = pattern[byteGroups.length % pattern.length]!

			if (group.length >= max) {
				byteGroups.push(group)
				group = []
			}
		}

		if (group.length > 0)
			byteGroups.push(group)

		return byteGroups
	}

	logAllFirstnames() {
		const firstNames: string[] = []

		for (const prefix of this.prefixes) {
			for (const suffix of this.suffixes)
				firstNames.push(prefix + suffix)
		}

		while (firstNames.length > 0) {
			console.log(firstNames.splice(0, 8).join(", "))
		}
	}
}

for (const _ of Array(100))
	console.log(Byterunes.standard.random())

// const potionRunes = new Byterunes({
// 	prefixes: [
// 		"Ale",
// 		"Gaz",
// 		"Gor",
// 		"Wez",
// 		"Wor",
// 		"Whi",
// 		"Wyn",
// 		"Yan",
// 		"Yez",
// 		"Xve",
// 		"Xhe",
// 		"Xor",
// 		"Xen",
// 		"Zor",
// 		"Zal",
// 		"Zel",
// 	],
// 	suffixes: [
// 		"il",
// 		"el",
// 		"lo",
// 		"le",
// 		"sk",
// 		"ic",
// 		"ik",
// 		"lk",
// 		"om",
// 		"em",
// 		"rm",
// 		"im",
// 		"in",
// 		"on",
// 		"oz",
// 		"ow",
// 	],
// })
//
// for (const _ of Array(100))
// 	console.log(potionRunes.random())

