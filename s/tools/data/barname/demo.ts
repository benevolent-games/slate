
import {Hex} from "../hex.js"
import {Badge} from "./badge.js"
import {Bytes} from "../bytes.js"
import {Barname} from "./barname.js"

for (const _ of Array(2)) {
	const string = Barname.random(34)
	const bytes = Barname.bytes(string)
	const string2 = Barname.string(bytes)
	console.log(string.replaceAll(" ", "\n"))
	if (string !== string2)
		throw new Error("barname fails equality check")
	console.log("")
}

for (const _ of Array(10)) {
	const bytes = Bytes.random(32)
	const badge = new Badge(bytes)
	const bytes2 = badge.bytes
	console.log(badge.string)
	if (Hex.string(bytes) !== Hex.string(bytes2))
		throw new Error("badge fails equality check")
}

{
	console.log("")
	const alpha = `
		dacsyd_labdun_fipsub_bonmel
		fitlys_rovbud_sipnel_sonryx
		sitrem_lasdyr_dovpun_nibwep
		tippet_mapnub_ticnet_famset
		wanteg
	`
	const bravo = `
		dacsyd-labdun-fipsub-bonmel;
		[fitlys rovbud sipnel sonryx]
		sitrem/lasdyr/dovpun/nibwep
		tippet+mapnub+ticnet+famset
		wanteg++
	`
	const alphaHex = Hex.string(Barname.bytes(alpha))
	const bravoHex = Hex.string(Barname.bytes(bravo))
	if (alphaHex.length === 68 && alphaHex === bravoHex)
		console.log("*barname parsing appears resilient to whitespace and garbage*")
	else
		throw new Error("barname resiliency failure")
}

