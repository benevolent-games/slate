
import {parse_exportparts, parse_part, parse_prefixes, query_attributes, stitch_exportparts_together} from "./utils.js"

export function auto_exportparts(
		container: HTMLElement,
		root: ShadowRoot,
	) {

	const prefixes = parse_prefixes(container.getAttribute("part"))
	const gprefixes = parse_prefixes(container.getAttribute("data-gpart"))

	const attrs = query_attributes(root, {
		part: "part",
		gpart: "data-gpart",
		exportparts: "exportparts",
		gexportparts: "gexportparts",
	})

	const parts = new Set<string>([
		...attrs.part.flatMap(parse_part),
		...attrs.exportparts.flatMap(parse_exportparts),
	])

	const gparts = new Set<string>([
		...attrs.gpart.flatMap(parse_part),
		...attrs.gexportparts.flatMap(parse_part),
	])

	if (parts.size)
		container.setAttribute(
			"exportparts",
			[...prefixes]
				.flatMap(stitch_exportparts_together(parts, gparts))
				.join(", "),
		)

	if (gparts.size || container.hasAttribute("data-gpart"))
		container.setAttribute(
			"gexportparts",
			[
				...gparts,
				...[...gprefixes]
					.flatMap(prefix => [...parts].map(part => `${prefix}-${part}`)),
			].join(" ")
		)
}

