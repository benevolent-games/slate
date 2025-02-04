
import {Urname} from "./urname.js"

for (const _ of Array(20)) {
	const string = Urname.random(6)
	const bytes = Urname.bytes(string)
	const string2 = Urname.string(bytes)
	console.log(string)
	if (string !== string2)
		throw new Error("urname fail")
}

