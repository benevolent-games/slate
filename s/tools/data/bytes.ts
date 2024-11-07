
export const Bytes = {
	random(count = 32) {
		return crypto.getRandomValues(new Uint8Array(count))
	},
}

