
import {Phrases} from "./phrases.js"

export type PhrasingSpec = Record<string, string[]>
export type Phrasing<P extends PhrasingSpec> = Record<keyof P, Phrases>

export type RunePattern<P extends PhrasingSpec> = (keyof P)[][]
export type RuneSpec<P extends PhrasingSpec> = {pattern: RunePattern<P>, phrasing: P}

export const runeSpec = () => ({
	phrasing: <P extends PhrasingSpec>(phrasing: P) => ({
		pattern: (pattern: RunePattern<P>) => ({
			pattern,
			phrasing,
		} as RuneSpec<P>),
	})
})

