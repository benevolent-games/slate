
export const Bytes = {
	random(count: number) {
		return crypto.getRandomValues(new Uint8Array(count))
	},
}

