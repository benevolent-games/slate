
import {CSSResultGroup, TemplateResult, render} from "lit"

import {SlateView} from "./slate_view_element.js"
import {auto_exportparts} from "./auto_exportparts/auto.js"
import {apply_styles_to_shadow} from "../../base/utils/apply_styles_to_shadow.js"

export function make_view_root({
		name, css, afterRender, onConnected, onDisconnected,
	}: {
		name: string,
		css: CSSResultGroup | undefined,
		afterRender: () => void
		onConnected: () => void
		onDisconnected: () => void
	}) {

	const container = document.createElement(SlateView.tag) as SlateView
	container.setAttribute("view", name)

	container.onConnected(onConnected)
	container.onDisconnected(onDisconnected)

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

			afterRender()
			return container
		},
	}
}

