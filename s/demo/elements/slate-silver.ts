
import {html} from "lit"
import {SilverElement} from "../../element/silver.js"
import {QuartzTripler} from "../views/quartz-tripler.js"
import {ObsidianQuadrupler} from "../views/obsidian-quadrupler.js"

export class SlateSilver extends SilverElement {
	render() {
		return html`
			${QuartzTripler(1)}
			${ObsidianQuadrupler([33])}
		`
	}
}

