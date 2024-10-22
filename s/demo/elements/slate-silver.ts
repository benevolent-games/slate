
import {html} from "lit"
import {NestingOuter} from "../views/nesting.js"
import {LightElement} from "../../element/silver.js"
import {QuartzTripler} from "../views/quartz-tripler.js"
import {ObsidianQuadrupler} from "../views/obsidian-quadrupler.js"

export class SlateSilver extends LightElement {
	render() {
		return html`
			${QuartzTripler(1)}
			${ObsidianQuadrupler([33])}
			<br/>
			${NestingOuter([1])}
		`
	}
}

