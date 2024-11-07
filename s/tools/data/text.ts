
export const Text = {
	string(bytes: Uint8Array) {
		return new TextDecoder().decode(bytes)
	},

	bytes(string: string) {
		return new TextEncoder().encode(string)
	},
}

