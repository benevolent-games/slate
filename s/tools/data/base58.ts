
/*

256-bit base58 ids look like this:

	9X1D9rdkDgRdykzmogNcxfopRc7TnbS869ow1E2ehCFS
	AmRKyNfq6jhhsd9qda1Y6rAVS2NLUqyTUvfcB2wUiiAC
	8skYcqBAXsejDcJzsZMo19PErt43DHP3bykaXBtMvdu

*/

import {Hex} from "./hex.js"
import {Bytes} from "./bytes.js"

const base = 58
const characters = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

export const Base58 = Object.freeze({
	string(bytes: Uint8Array) {
		let intVal = BigInt("0x" + Hex.string(bytes))
		let encoded = ""

		while (intVal > 0) {
			const remainder = intVal % BigInt(base)
			intVal = intVal / BigInt(base)
			encoded = characters[Number(remainder)] + encoded
		}

		for (const byte of bytes) {
			if (byte === 0) encoded = characters[0] + encoded
			else break
		}

		return encoded
	},

	bytes(string: string) {
		let intVal = BigInt(0)

		for (const char of string) {
			const index = characters.indexOf(char)
			if (index === -1) throw new Error(`Invalid character '${char}' in base58 string`)
			intVal = intVal * BigInt(base) + BigInt(index)
		}

		let hex = intVal.toString(16)
		if (hex.length % 2 !== 0) hex = "0" + hex
		const bytes = Hex.bytes(hex)

		let leadingZeroes = 0
		for (const char of string) {
			if (char === characters[0]) leadingZeroes++
			else break
		}

		const decoded = new Uint8Array(leadingZeroes + bytes.length)
		decoded.set(bytes, leadingZeroes)
		return decoded
	},

	random(count = 32) {
		return this.string(Bytes.random(count))
	},
})

