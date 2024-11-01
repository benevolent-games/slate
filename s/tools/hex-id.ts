
export function hexId(bytes = 32) {
	const array = new Uint8Array(bytes)
	const random = crypto.getRandomValues(array)
	return [...random]
		.map(b => b.toString(16).padStart(2, "0"))
		.join("")
}

/** @deprecated renamed to `hexId` */
export const generate_id = hexId

