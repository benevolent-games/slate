
/*

256-bit hex ids look like this:

	8ff8dfbc7c994c5439d2dd327b9898aa6796f97fb396e262985f03f868707e32
	6b99284a2c4a1c5f101502bd009f9fb592ca4427e4375155e411ddd07ed9da6b
	2eb73fb00a2b9e38c855b5aa353b530d820a3a2dcea5013b7e4e277ddfe9d0ad

*/

import {Bytes} from "./bytes.js"

export const Hex = {
	string(bytes: Uint8Array) {
		return [...bytes]
			.map(byte => byte.toString(16).padStart(2, "0"))
			.join("")
	},

	bytes(string: string) {
		if (string.length % 2 !== 0)
			throw new Error("must have even number of hex characters")
		const bytes = new Uint8Array(string.length / 2)
		for (let i = 0; i < string.length; i += 2)
			bytes[i / 2] = parseInt(string.slice(i, i + 2), 16)
		return bytes
	},

	random(count = 32) {
		return this.string(Bytes.random(count))
	},
}

