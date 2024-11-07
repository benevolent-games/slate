
/*

"anka" is an alternative to base64 that i totally made up.
	- it looks cool because it features characters from the indian subcontinent.
	- each byte is represented by one character, which makes a 256 bit id incomparably short at only 32 characters.
	- however, it's probably a bad idea, for these negative reasons:
		1. many of these characters are actually 2-or-3-byte sequences (so even though anka is visually more compact than base64 to the user, it's actually more data in terms of bytes).
		2. it's horrible for url-encoding.
		3. it's horrible for trying to manually copy by typing.

256-bit anka ids look like this:

	ஒഐওଆઊসਅവஎଉखਬശயഘसചവਭଏரঊझഠடଓઐഴঠണവઞ
	ठକநइஎਦਏஒഊটਹஜഴयભকயঙਪഉजकঝഐवઠসഏਓਡਟऋ
	થঞठખஉધഫரਜऐફരਪਙਗഭਣഎफઇমએরଔડਉதਤஅदઘച

*/

import {Bytes} from "./bytes.js"

const characters = [...new Set([
	// devanagari
	..."अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह",

	// tamil
	..."அஆஇஈஉஊஎஏஐஒஓகஙசஜஞடணதநபமயரலவழளறன",

	// bengali
	..."অআইঈউঊএঐওকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ",

	// gurmukhi
	..."ਅਆਇਈਉਊਏਐਓਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵਸਹ",

	// malayalam
	..."അആഇഈഉഊഎഏഐഒഓകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരലവശസഹളഴറ",

	// gujarati
	..."અઆઇઈઉઊએઐઓકખગઘઙચછજઝઞટઠડઢણતથદધનપફબભમયરલવશષસહ",

	// odia
	..."ଅଆଇଈଉଊଏଐଓଔକଖଗଘଙଚଛଜଝଞଟଠଡଢଣତଥଦଧନପଫବଭମଯରଲଶଷସହ",
])]

export const Anka = Object.freeze({

	string(bytes: Uint8Array) {
		return [...bytes]
			.map(int => characters.at(int))
			.join("")
	},

	bytes(code: string) {
		return new Uint8Array([...code].map(char => {
			const index = characters.indexOf(char)
			if (index === -1)
				throw new Error(`invalid crunch character "${char}"`)
			return index
		}))
	},

	random(count = 32) {
		return this.string(Bytes.random(count))
	},
})

