
import {Hex} from "../hex.js"
import {Badge} from "./badge.js"
import {Bytes} from "../bytes.js"
import {Barname} from "./barname.js"

for (const _ of Array(10)) {
	const string = Barname.random(4)
	const bytes = Barname.bytes(string)
	const string2 = Barname.string(bytes)
	console.log(string)
	if (string !== string2)
		throw new Error("barname fails equality check")
}

for (const _ of Array(10)) {
	const bytes = Bytes.random(32)
	const badge = new Badge(bytes)
	const bytes2 = badge.bytes
	console.log(badge.string)
	if (Hex.string(bytes) !== Hex.string(bytes2))
		throw new Error("badge fails equality check")
}

