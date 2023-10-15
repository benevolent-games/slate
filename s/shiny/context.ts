
import {css, CSSResultGroup} from "lit"
import {Flat} from "../flatstate/flat.js"
import {SignalTower} from "../signals/tower.js"

export class Context {
	theme: CSSResultGroup = css``
	flat = new Flat()
	tower = new SignalTower()
}

