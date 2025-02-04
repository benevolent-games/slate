
import {runeSpec} from "../parts/types.js"
import {RuneDictionary} from "../parts/dictionary.js"

export const falrysk = (runeSpec()
	.phrasing({
		prefix: [
			"Aed", "Ång", "Éil", "War",
			"End", "Gäl", "Gar", "Thó",
			"Tír", "Ven", "Fen", "Fâl",
			"Nýz", "Mór", "Nor", "Lom",
		],

		// alpha: [
		// 	"b", "c", "d", "f",
		// 	"g", "h", "k", "l",
		// 	"m", "n", "r", "s",
		// 	"t", "v", "w", "y",
		// ],

		alpha: [
			"ak", "ëk", "ud", "ok",
			"ár", "th", "ýg", "sk",
			"fy", "ég", "ug", "øg",
			"aʼ", "st", "kn", "gh",
		],

		bravo: [
			"au", "ea", "ia", "oa",
			"ae", "ës", "ie", "oé",
			"ai", "ei", "iu", "uî",
			"al", "eo", "io", "us",
		],

		suffix: [
			"th", "st", "yt", "ft",
			"sk", "rk", "rd", "nd",
			"by", "cy", "ry", "ny",
			"yn", "vn", "vy", "ly",
		],
	})

	.pattern([
		["prefix", "bravo", "suffix"],
		["prefix", "alpha", "alpha", "bravo", "suffix"],
	])
)

export const falryskPlain = RuneDictionary.plainify(falrysk)

