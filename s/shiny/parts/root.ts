
import {CSSResultGroup, TemplateResult, render} from "lit"

import {ObsidianView} from "./obsidian-view.element.js"
import {auto_exportparts} from "./auto_exportparts/auto.js"
import {apply_styles_to_shadow} from "../../base/utils/apply_styles_to_shadow.js"

export function make_view_root({name, css, onConnected, onDisconnected}: {
		name: string,
		css: CSSResultGroup | undefined,
		onConnected: () => void
		onDisconnected: () => void
	}) {

	const container = document.createElement(ObsidianView.tag) as ObsidianView
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

			return container
		},
	}
}

