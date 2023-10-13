
import {render} from "lit"
import {ObsidianMeta} from "./types.js"
import {apply_attributes} from "../../view/parts/apply_attributes.js"

export function apply_details(
		element: HTMLElement,
		freshMeta: ObsidianMeta = {},
		oldMeta: ObsidianMeta = {},
	) {

	const {content, attributes: fresh = {}} = freshMeta
	const {attributes: old = {}} = oldMeta

	function actuate<V>(freshvalue: V, oldvalue: V, name: string, value: () => string) {
		if (freshvalue !== oldvalue) {
			if (freshvalue === undefined)
				element.removeAttribute(name)
			else
				element.setAttribute(name, value())
		}
	}

	if (fresh)
		apply_attributes(element, fresh)

	actuate(
		fresh.class,
		old?.class,
		"class",
		() => fresh.class!,
	)

	actuate(
		fresh.part,
		old?.part,
		"part",
		() => fresh.part!,
	)

	actuate(
		fresh.gpart,
		old?.gpart,
		"data-gpart",
		() => fresh.gpart!,
	)

	if (content)
		render(content, element, {host: element})
}

