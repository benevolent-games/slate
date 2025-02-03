
import {Runes} from "./runes.js"

const runes = new Runes()

for (const _ of Array(20)) {
	const string1 = runes.random()
	const bytes = runes.bytes(string1)
	const string2 = runes.string(bytes)
	if (string1 !== string2)
		throw new Error("mismatch")
	console.log(string1)
}

