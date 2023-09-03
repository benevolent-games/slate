
import {CSSResultGroup, CSSResultOrNative, getCompatibleStyle} from "lit"

export function finalize_styles(styles?: CSSResultGroup): Array<CSSResultOrNative> {
	const elementStyles = []

	if (Array.isArray(styles)) {
		const set = new Set((styles as Array<unknown>).flat(Infinity).reverse())
		for (const s of set)
			elementStyles.unshift(getCompatibleStyle(s as CSSResultOrNative))
	}
	else if (styles !== undefined)
		elementStyles.push(getCompatibleStyle(styles))

	return elementStyles
}

