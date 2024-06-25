
import {css} from "../html.js"
import {defaultNexus} from "../nexus.js"
import {DirectiveResult} from "lit/async-directive.js"

const styles = css`
	:host {
		display: contents;
	}
`

/** wrap a shadow view into a shadow component */
export function shadowComponentify<V extends (p: []) => DirectiveResult<any>>(View: V) {
	return defaultNexus.shadowComponent(use => {
		use.styles(styles)
		return View([])
	})
}

