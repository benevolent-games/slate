
import {Bytes} from "./bytes.js"
import {Base64} from "./base64.js"

export const Base64url = {

	string(bytes: Uint8Array) {
		return Base64.string(bytes)
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/g, "")
	},

	bytes(string: string) {
		let b64 = string
			.replace(/-/g, "+")
			.replace(/_/g, "/")
		if (b64.length % 4 !== 0)
			b64 = b64.padEnd(b64.length + (4 - b64.length % 4) % 4, "=")
		return Base64.bytes(b64)
	},

	random(count = 32) {
		return this.string(Bytes.random(count))
	},
}

