
const vowels = [..."aeiou"]
const consonants = [..."bcdfghjklmnprstvwxyz"]

const bad = new Set([
	"cum", "kum", "cok", "kok", "coc", "tit", "ass", "fuk",
	"fuc", "fux", "sex", "dic", "dik", "dix", "suk", "pus",
	"vag", "jiz", "bum", "koc", "fag", "hoe", "fap", "pee",
	"poo", "zit", "nut", "hag", "jis", "gay", "but", "hag",
	"sac", "sak", "jap", "kik", "wop", "piv", "nob", "nad",
	"sux", "nig", "cox", "pep", "jew", "goy", "suc", "pen",
	"nip",
])

function subsample(n: number, arr: string[]) {
	const excess = arr.length - n;
	if (excess <= 0) return arr; // already the right size or smaller

	// use a precise incrementer to ensure exact removal count
	const interval = arr.length / excess;
	const result = [];
	let nextRemoveIndex = interval;

	for (let i = 0; i < arr.length; i++) {
		// remove item if we're at or just past the next removal point
		if (i >= Math.round(nextRemoveIndex)) {
			nextRemoveIndex += interval; // move to the next removal point
		} else {
			result.push(arr[i]);
		}
	}

	return result.slice(0, n); // ensure exactly n elements
}

function dedupe(arr: string[]) {
	return [...new Set(arr)]
}

export const xox = dedupe(subsample(
	256,
	consonants.map(
		a => vowels.map(
			b => consonants.map(
				c => (a + b + c)
			)
		)
	).flat(2).filter(x => !bad.has(x)),
))

export const oxo = dedupe(subsample(
	256,
	vowels.map(
		a => consonants.map(
			b => vowels.map(
				c => (a + b + c)))
	).flat(2).filter(x => !bad.has(x)),
))

export const combo = dedupe(subsample(256, [...xox, ...oxo]))

if (xox.length !== 256) throw new Error("xox not 256")
if (oxo.length !== 256) throw new Error("oxo not 256")
if (combo.length !== 256) throw new Error("syllables not 256")

