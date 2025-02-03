
export function plainifyString(string: string) {
	return string
		.replace("ʼ", "'")
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
}

