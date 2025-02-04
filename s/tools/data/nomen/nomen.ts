
import {ob} from "../../ob.js"
import {Bytes} from "../bytes.js"

export type Dictionary = Record<string, string[]>
export type Pattern<D extends Dictionary> = (keyof D)[][]

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

export type PhraseFn = (bytes: Uint8Array) => string
export type PhraseFns = Record<string, PhraseFn>
export type Phrases<P extends PhraseFns> = Record<keyof P, string>
export type GrammarTemplate<P extends PhraseFns> = (phrases: Phrases<P>) => string

export class Grammar<P extends PhraseFns> {
	constructor(public phraseFns: P, public templates: GrammarTemplate<P>[]) {}

	static phrases = <P extends PhraseFns>(phrases: P) => ({
		templates: (templates: GrammarTemplate<P>[]) => (
			new this<P>(phrases, templates)
		),
	})

	generate([firstByte, ...bytes]: Uint8Array) {
		const template = this.templates[firstByte % this.templates.length]
		const phraseCount = Object.keys(this.phraseFns).length
		const bytesPerPhrase = Math.floor(bytes.length / phraseCount)

		let indexCounter = 0

		const phrases = ob(this.phraseFns).map(fn => {
			const index = indexCounter++
			const start = index * bytesPerPhrase
			const end = Math.min(start + bytesPerPhrase, bytes.length - 1)
			const buffer = new Uint8Array(bytes.slice(start, end))
			return fn(buffer)
		})

		return template(phrases)
	}

	random() {
		const buffer = Bytes.random(32)
		return this.generate(buffer)
	}
}

export const falryskNomen = Nomen
	.dictionary({
		prefix: [
			"Aed", "Ång", "Éil", "War",
			"End", "Gäl", "Gar", "Thó",
			"Tír", "Ven", "Fen", "Fâl",
			"Nýz", "Mór", "Nor", "Lom",
		],

		suffix: [
			"th", "st", "yt", "ft",
			"sk", "rk", "rd", "nd",
			"by", "cy", "ry", "ny",
			"yn", "vn", "vy", "ly",
		],

		a: [
			"b", "c", "d", "f",
			"g", "h", "k", "l",
			"m", "n", "r", "s",
			"t", "v", "w", "y",
		],

		b: [
			"ak", "ëk", "ud", "ok",
			"ár", "th", "ýg", "sk",
			"fy", "ég", "ug", "øg",
			"aʼ", "st", "kn", "gh",
		],

		c: [
			"au", "ea", "ia", "oa",
			"ae", "ës", "ie", "oé",
			"ai", "ei", "iu", "uî",
			"al", "eo", "io", "us",
		],
	})
	.patterns([
		[["prefix", "suffix"]],
		[["prefix", "b", "suffix"]],
		[["prefix", "b", "c", "suffix"]],
	])

const grammar = Grammar
	.phrases({
		first: bytes => falryskNomen.generate(bytes),
		last: bytes => falryskNomen.generate(bytes),
	})
	.templates([
		o => `${o.first}`,
		o => `${o.first}`,
		o => `${o.first} ${o.last}`,
		o => `${o.first} ${o.last}`,
		o => `${o.first} of ${o.last}`,
		o => `${o.first} from ${o.last}`,
		o => `${o.first} of the ${o.last}`,
	])

for (const _ of Array(20))
	console.log(grammar.random())

