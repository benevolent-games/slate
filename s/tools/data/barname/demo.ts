
import {Barname} from "./barname.js"

for (const _ of Array(20)) {
	const string = Barname.random(4)
	const bytes = Barname.bytes(string)
	const string2 = Barname.string(bytes)
	console.log("_" + string)
	if (string !== string2)
		throw new Error("barname fail")
}

