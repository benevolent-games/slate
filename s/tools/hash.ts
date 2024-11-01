
export async function hash(text: string): Promise<string> {
	const bytes = new TextEncoder().encode(text)
	const hashed = await crypto.subtle.digest("SHA-256", bytes)
	return Array.from(new Uint8Array(hashed))
		.map(b => b.toString(16).padStart(2, "0"))
		.join("")
}

