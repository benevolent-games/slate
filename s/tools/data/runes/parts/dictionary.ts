
import {ob} from "../../../ob.js"
import {Phrases} from "./phrases.js"
import {plainifyString} from "./plainify-string.js"
import {Phrasing, PhrasingSpec, RunePattern, RuneSpec} from "./types.js"

export class RuneDictionary<P extends PhrasingSpec = PhrasingSpec> {
	pattern: RunePattern<P>
	phrasing: Phrasing<P>

	constructor(spec: RuneSpec<P>) {
		this.pattern = spec.pattern
		this.phrasing = ob(spec.phrasing).map(strings => new Phrases(strings))
	}

	static plainify<P extends PhrasingSpec>(options: RuneSpec<P>) {
		return {
			pattern: options.pattern,
			phrasing: ob(options.phrasing).map(strings => strings.map(plainifyString)),
		} as RuneSpec<P>
	}
}

