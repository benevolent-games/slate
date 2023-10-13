
import {css, CSSResultGroup} from "lit"
import {Flat} from "../flatstate/flat.js"
import {CueGroup} from "../cues/group.js"

export class Context {
	theme: CSSResultGroup = css``
	flat = new Flat()
	cues = new CueGroup()
}

