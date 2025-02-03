
export const Nibbles = {
	split(...bytes: number[]) {
		return bytes.flatMap(byte => {
			const high = (byte >> 4) & 0x0F
			const low = byte & 0x0F
			return [high, low] as [number, number]
		})
	},

	merge(nibbleA: number, nibbleB: number) {
		return (nibbleA << 4) | (nibbleB & 0x0F)
	},
}

