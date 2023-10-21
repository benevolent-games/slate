
export const deepEqual = (alpha: any, bravo: any) => {
	if (alpha === bravo) return true

	if (typeof alpha !== 'object' || alpha === null || typeof bravo !== 'object' || bravo === null)
		return false

	const keys1 = Object.keys(alpha)
	const keys2 = Object.keys(bravo)

	if (keys1.length !== keys2.length) return false

	for (const key of keys1) {
		if (!keys2.includes(key)) return false
		if (!deepEqual(alpha[key], bravo[key])) return false
	}

	return true
}

