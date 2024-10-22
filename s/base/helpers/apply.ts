
import {CSSResultGroup} from "lit"

import * as state from "../../nexus/state.js"

import {mixin} from "./mixin.js"
import {ob} from "../../tools/ob.js"
import {Pipe} from "../../tools/pipe.js"
import {Flat} from "../../flatstate/flat.js"
import {Context} from "../../nexus/context.js"
import {BaseElementClasses} from "../element.js"
import {SignalTower} from "../../signals/tower.js"

export namespace apply {

	export const css = (
		(theme: CSSResultGroup) => (
			<E extends BaseElementClasses>(elements: E) => (
				ob(elements).map(Element => mixin.css(theme)(Element))
			)
		)
	)

	export const flat = (
		(flat: Flat) => (
			<E extends BaseElementClasses>(elements: E) => (
				ob(elements).map((Element: any) => mixin.flat(flat)(Element))
			)
		)
	)

	export const signals = (
		(signals: SignalTower) => (
			<E extends BaseElementClasses>(elements: E) => (
				ob(elements).map((Element: any) => mixin.signals(signals)(Element))
			)
		)
	)

	export const reactive = (
		(r = state.reactor) => (
			<E extends BaseElementClasses>(elements: E) => (
				ob(elements).map((Element: any) => mixin.reactive(r)(Element))
			)
		)
	)

	/** @deprecated use `reactive` instead */
	export const reactor = reactive

	/** @deprecated use `setup` instead */
	export const context = (
		(context: Context) => (
			<E extends BaseElementClasses>(elements: E) => (
				Pipe.with(elements)
					.to(css(context.theme))
					.to(reactive())
					.done() as E
			)
		)
	)

	export const setup = (
		(...styles: CSSResultGroup[]) => (
			<E extends BaseElementClasses>(elements: E) => (
				ob(elements).map((Element: any) => mixin.setup(...styles)(Element))
			)
		)
	)
}

