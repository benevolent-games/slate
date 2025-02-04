
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
			"Aed", "Ael", "Aer", "Aeg",
			"Aes", "Aet", "Aeon", "Aek",
			"Årg", "Ard", "Arn", "Ayn",
			"Ar", "Ad", "Atl", "An",
			"And", "Anr", "Ain", "Ayn",
			"End", "Esk", "Eld", "Ŏln",
			"Elg", "Erd", "Eyn", "Esn",
			"Olf", "Of", "Oy", "Oc",
			"War", "Wer", "Wot", "Wal",
			"Gäl", "Gar", "Gra", "Gir",
			"Gor", "Gil", "Ger", "Gan",
			"Thós", "Thès", "Tír", "Tal",
			"Fâl", "Fen", "Fel", "Fol",
			"Fír", "For", "Feyt", "Fern",
			"Feyn", "Fayn", "Feln", "Faln",
			"Ven", "Van", "Vèl", "Val",
			"Veyn", "Vayn", "Veyl", "Vayl",
			"Nýz", "Nor", "Nal", "Nyn",
			"Mór", "Mar", "Myor", "Mor",
			"Lom", "Lem", "Lorn", "Leyn",
			"Kal", "Kel", "Kyel", "Kol",
			"Shel", "Shen", "Shal", "Shey",
			"Pip", "Par", "Pyot", "Poy",
			"Thar", "Ther", "Thor", "Thel",
			"Uyn", "Uer", "Usn", "Uin",
			"Yön", "Yès", "Yol", "Yel",
			"Xen", "Zael", "Zaer", "Zod",
			"Aʼ", "Oʼ",
		],

		suffix: [
			"th", "st", "yt", "ft",
			"sk", "rk", "rd", "nd",
			"by", "cy", "ry", "ny",
			"yn", "vn", "vy", "ly",
			"rik", "rek", "nok", "rôk",
			"bie", "rie", "lie",
			"nar", "råg", "lg", "rn",
		],

		o: [..."aaeeiou"],
		x: [..."bcdfghjklmnprstvwxyz"],

		oo: [
			"au", "ea", "ía", "oa",
			"áe", "ës", "ie", "oé",
			"aí", "ei", "iû", "uî",
			"al", "eo", "io", "us",
		],

		ox: [
			"ës", "us", "is", "os",
			"as", "ar", "er", "or",
			"ad", "ed", "id", "od",
			"aw", "ew", "iw", "ow",
		],

		xox: [
			"nak", "nëk", "nud", "nok",
			"rár", "råth", "ýeg", "rin",
			"wég", "wug", "wøg",
		],

		oxo: [
			"ana", "ëna", "anu", "irá",
			"arna", "erna", "arnû", "irna",
			"ánla", "ënla", "arlu", "irla",
			"ára", "atho", "oýo", "ina",
			"éwe", "uwa", "øga",
		],
	})
	.patterns([
		[["prefix", "o"]],
		[["prefix", "oo"]],
		[["prefix", "ox"]],
		[["prefix", "ox"]],
		[["prefix", "oxo"]],
		[["prefix", "o", "suffix"]],
		[["prefix", "o", "suffix"]],
		[["prefix", "oxo", "suffix"]],
		[["prefix", "oo", "suffix"]],
		[["prefix", "oo", "x", "oo", "suffix"]],
		[["prefix", "o", "x", "oo", "suffix"]],
	])

const grammar = Grammar
	.phrases({
		first: bytes => falryskNomen.generate(bytes),
		last: bytes => falryskNomen.generate(bytes),
	})
	.templates([
		o => `${o.first} ${o.last}`,
		o => `${o.first} ${o.last}`,
		o => `${o.first} ${o.last}`,
		o => `${o.first} of ${o.last}`,
		o => `${o.first} from ${o.last}`,
	])

for (const _ of Array(20))
	console.log(grammar.random())

