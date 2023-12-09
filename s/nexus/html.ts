
import {Signal} from "../signals/signal.js"
import {TemplateResult, html as lit_html} from "lit"

export {css, svg} from "lit"

export const html = (
		strings: TemplateStringsArray,
		...values: any[]
	): TemplateResult => (

	lit_html(strings, ...values.map(value => (
		(value instanceof Signal)
			? value.value
			: value
	)))
)

