
import {html} from "lit"
import {component} from "../frontend.js"
import {SilverElement} from "../../element/silver.js"
import {QuartzTripler} from "../views/quartz-tripler.js"
import {ObsidianQuadrupler} from "../views/obsidian-quadrupler.js"

export const SlateSilver = component(_context => class extends SilverElement {
	render() {
		return html`
			${QuartzTripler(1)}
			${ObsidianQuadrupler([33])}
		`
	}
})

