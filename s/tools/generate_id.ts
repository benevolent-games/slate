
export function generate_id(bytes = 32) {
	const array = new Uint8Array(bytes)
	const random = crypto.getRandomValues(array)
	return [...random]
		.map(b => b.toString(16).padStart(2, "0"))
		.join("")
}

