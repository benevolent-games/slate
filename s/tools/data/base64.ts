
import {Bytes} from "./bytes.js"

export const Base64 = {

	string(bytes: Uint8Array) {
		return (typeof btoa === "function")
			? btoa(String.fromCharCode(...bytes))
			: Buffer.from(bytes).toString("base64")
	},

	bytes(string: string) {
		return (typeof atob === "function")
			? Uint8Array.from(atob(string), char => char.charCodeAt(0))
			: Uint8Array.from(Buffer.from(string, "base64"))
	},

	random(count = 32) {
		return this.string(Bytes.random(count))
	},
}

