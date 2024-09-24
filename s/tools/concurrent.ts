
export async function concurrent<O extends Record<string, Promise<any>>>(
		ob: O,
	) {
	const entries = Object.entries(ob)
	const promises = entries.map(([,promise]) => promise)
	const values = await Promise.all(promises)
	return (
		Object.fromEntries(entries.map(([key], index) => [key, values[index]]))
	) as {[K in keyof O]: Awaited<O[K]>}
}

