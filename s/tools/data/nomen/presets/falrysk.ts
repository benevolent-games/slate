
import {Nomen} from "../nomen.js"
import {Grammar} from "../grammar.js"

export function falryskNameGrammar() {
	const person = Nomen
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
				"Gäl", "Gar", "Gaer", "Gir",
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
			x: [..."bcdfghklmnprstvwxyz"],

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

	return Grammar
		.phrases({
			first: bytes => person.generate(bytes),
			last: bytes => person.generate(bytes),
		})
		.templates([
			o => `${o.first} ${o.last}`,
			o => `${o.first} ${o.last}`,
			o => `${o.first} ${o.last}`,
			o => `${o.first} of ${o.last}`,
			o => `${o.first} from ${o.last}`,
		])
}

