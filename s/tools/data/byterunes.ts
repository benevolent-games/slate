
import {Bytes} from "./bytes.js"

const prefixes = [
	"Ael", "Ång", "Éil", "Chå",
	"End", "Gäl", "Gar", "Thó",
	"Tír", "Vel", "Fen", "Fâl",
	"Nýl", "Mór", "Nor", "Lom",
]

const doublets1 = [
	"rá", "rë", "ri", "ró",
	"va", "ve", "vi", "vo",
	"aʼ", "eʼ", "iʼ", "oʼ",
	"la", "le", "ýi", "yø",
]

const doublets2 = [
	"ar", "er", "ir", "or",
	"rn", "rd", "ln", "el",
	"th", "ey", "aý", "oy",
	"un", "ur", "us", "es",
]

const suffixes = [
	"il", "lo", "le", "sk",
	"âr", "or", "ýn", "vn",
	"by", "cy", "gy", "ky",
	"ly", "th", "vy", "ny",
]

export class Byterunes {
	static standard = new Byterunes()
	pattern: number[]
	prefixes: string[]
	doublets1: string[]
	doublets2: string[]
	suffixes: string[]

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
			pattern?: number[]
			prefixes?: string[]
			doublets1?: string[]
			doublets2?: string[]
			suffixes?: string[]
		} = {}) {

		this.pattern = options.pattern ?? [1, 2]
		this.prefixes = Byterunes.validate("prefixes", options.prefixes ?? prefixes, 3, 16)
		this.doublets1 = Byterunes.validate("doublets2", options.doublets1 ?? doublets1, 2, 16)
		this.doublets2 = Byterunes.validate("doublets1", options.doublets2 ?? doublets2, 2, 16)
		this.suffixes = Byterunes.validate("suffixes", options.suffixes ?? suffixes, 2, 16)
	}

	string(bytes: Uint8Array) {
		const byteGroups = this.#organizeByteGroups(bytes)
		const words: string[] = []

		for (const group of byteGroups)
			words.push(this.#generateWord(group))

		return words.join(" ")
	}

	random(byteCount = 3) {
		return this.string(Bytes.random(byteCount))
	}

	#splitByteIntoNibbles(byte: number) {
		const high = (byte >> 4) & 0x0F
		const low = byte & 0x0F
		return [high, low] as [number, number]
	}

	#nibblize(bytes: number[]) {
		return bytes.flatMap(byte => this.#splitByteIntoNibbles(byte))
	}

	#generateWord(bytes: number[]) {
		bytes = [...bytes]
		const nibbles = this.#nibblize(bytes)

		const prefix = this.prefixes[nibbles.shift()!]
		const suffix = this.suffixes[nibbles.pop()!]

		const pattern = [this.doublets1, this.doublets2]
		const middles: string[] = []

		for (const middle of nibbles) {
			const middleSource = pattern[middles.length % pattern.length]!
			middles.push(middleSource[middle])
		}

		return [prefix, ...middles, ...suffix].join("")
	}

	#organizeByteGroups(bytes: Uint8Array) {
		const {pattern} = this
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

for (const _ of Array(20))
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

