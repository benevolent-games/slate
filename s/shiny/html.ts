
import {Cue} from "../cues/cue.js"
import {TemplateResult, html as lit_html} from "lit"

export {svg, css} from "lit"

export const html = (
		strings: TemplateStringsArray,
		...values: any[]
	): TemplateResult => (

	lit_html(strings, ...values.map(value => (
		(value instanceof Cue)
			? value.value
			: value
	)))
)

