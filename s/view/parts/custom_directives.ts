
import {LightView, View, ViewInputs} from "./types.js"
import {DirectiveClass, DirectiveResult} from "lit/async-directive.js"

export const custom_directive_with_detail_input = (
	<C extends DirectiveClass>(c: C) => (
		(data: ViewInputs<any[]>): DirectiveResult<C> => ({
			['_$litDirective$']: c,
			values: [
				data,
			],
		})
	) as View<any>
)

export const custom_directive_for_light_view = (
	<C extends DirectiveClass>(c: C) => (
		(data: ViewInputs<any[]>): DirectiveResult<C> => ({
			['_$litDirective$']: c,
			values: [
				data,
			],
		})
	) as LightView<any>
)

