
import {CSSResultGroup, adoptStyles} from "lit"
import {finalize_styles} from "./finalize_styles.js"

export function apply_styles_to_shadow(shadow: ShadowRoot, styles?: CSSResultGroup) {
	adoptStyles(shadow, finalize_styles(styles))
}

