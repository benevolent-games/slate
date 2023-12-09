
import {ShadowViewMeta} from "./types.js"
import {DirectiveResult} from "lit/async-directive.js"

export const custom_lit_directive_for_shadow_view = (
	<P extends any[]>(c: any) => (
		(props: P, meta: ShadowViewMeta = {}): DirectiveResult<any> => ({
			['_$litDirective$']: c,
			values: [{meta, props}],
		})
	)
)

