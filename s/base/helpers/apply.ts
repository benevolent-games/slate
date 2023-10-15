
import {CSSResultGroup} from "lit"

import {mixin} from "./mixin.js"
import {ob} from "../../tools/ob.js"
import {Flat} from "../../flatstate/flat.js"
import {BaseElementClasses} from "../element.js"
import {SignalTower} from "../../signals/tower.js"

export namespace apply {

	export const css = (
		(theme: CSSResultGroup) => (
			<E extends BaseElementClasses>(elements: E) => (
				ob.map(elements, Element => mixin.css(theme)(Element))
			)
		)
	)

	export const flat = (
		(flat: Flat) => (
			<E extends BaseElementClasses>(elements: E) => (
				ob.map(elements, (Element: any) => mixin.flat(flat)(Element))
			)
		)
	)

	export const signals = (
		(tower: SignalTower) => (
			<E extends BaseElementClasses>(elements: E) => (
				ob.map(elements, (Element: any) => mixin.signals(tower)(Element))
			)
		)
	)
}

