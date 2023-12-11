
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

	export const reactor = (
		(r = state.reactor) => (
			<E extends BaseElementClasses>(elements: E) => (
				ob(elements).map((Element: any) => mixin.reactor(r)(Element))
			)
		)
	)

	export const context = (
		(context: Context) => (
			<E extends BaseElementClasses>(elements: E) => (
				Pipe.with(elements)
					.to(css(context.theme))
					.to(reactor())
					.done() as E
			)
		)
	)
}

