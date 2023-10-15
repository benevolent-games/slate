
import {ObsidianMeta} from "./types.js"
import {DirectiveResult} from "lit/async-directive.js"

export const obsidian_custom_lit_directive = (
	<P extends any[]>(c: any) => (
		(props: P, meta: ObsidianMeta = {}): DirectiveResult<any> => ({
			['_$litDirective$']: c,
			values: [{meta, props}],
		})
	)
)

