
import {Bytes} from "../bytes.js"
import {RuneEncoder} from "./parts/encoder.js"
import {RuneDecoder} from "./parts/decoder.js"
import {falrysk} from "./dictionaries/falrysk.js"
import {RuneDictionary} from "./parts/dictionary.js"

export class Runes {
	dictionary: RuneDictionary
	encoder: RuneEncoder
	decoder: RuneDecoder

	constructor(public spec = falrysk) {
		this.dictionary = new RuneDictionary(spec)
		this.encoder = new RuneEncoder(this.dictionary)
		this.decoder = new RuneDecoder(this.dictionary)
	}

	string(bytes: Uint8Array) {
		return this.encoder.string(bytes)
	}

	random(byteCount = 4) {
		const bytes = Bytes.random(byteCount)
		return this.string(bytes)
	}

	bytes(string: string) {
		return this.decoder.bytes(string)
	}
}

