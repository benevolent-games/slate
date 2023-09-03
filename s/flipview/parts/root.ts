
import {CSSResultGroup, TemplateResult, render} from "lit"

import {FlipView} from "./flip-view-element.js"
import {auto_exportparts} from "./auto_exportparts/auto.js"
import {apply_styles_to_shadow} from "../../base/utils/apply_styles_to_shadow.js"

export function make_view_root(
		name: string,
		css: CSSResultGroup | undefined,
	) {

	const container = document.createElement(FlipView.tag)
	container.setAttribute("view", name)

	const shadow = container.attachShadow({mode: "open"})
	apply_styles_to_shadow(shadow, css)

	let auto_exportparts_is_enabled = false

	return {
		container,
		shadow,

		set auto_exportparts(enabled: boolean) {
			auto_exportparts_is_enabled = enabled
		},

		render_into_shadow(content: TemplateResult | void) {
			render(content, shadow)

			if (auto_exportparts_is_enabled)
				auto_exportparts(container, shadow)

			return container
		},
	}
}

