
import {ObsidianMeta} from "./types.js"
import {DirectiveClass, DirectiveResult} from "lit/async-directive.js"

export const obsidian_custom_lit_directive = (
	<C extends DirectiveClass, P extends any[]>(c: C) => (
		(props: P, meta: ObsidianMeta = {}): DirectiveResult<C> => ({
			['_$litDirective$']: c,
			values: [{meta, props}],
		})
	)
)

