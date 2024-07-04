
import {css} from "../html.js"
import type {Context} from "../context.js"
import type {Nexus} from "../nexus.js"
import type {DirectiveResult} from "lit/async-directive.js"

const styles = css`
	:host {
		display: contents;
	}
`

/** wrap a shadow view into a shadow component */
export const prepare_shadow_componentify = <C extends Context>(nexus: Nexus<C>) => {
	return <V extends (p: []) => DirectiveResult<any>>(View: V) => {
		return nexus.shadowComponent(use => {
			use.styles(styles)
			return View([])
		})
	}
}

