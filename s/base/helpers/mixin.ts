
import {CSSResultGroup} from "lit"

import * as state from "../../nexus/state.js"

import {Pipe} from "../../tools/pipe.js"
import {Lean} from "../../reactor/types.js"
import {Flat} from "../../flatstate/flat.js"
import {BaseElementClass} from "../element.js"
import {SignalTower} from "../../signals/tower.js"

export namespace mixin {

	export function css(...newStyles: (undefined | CSSResultGroup)[]) {
		return function<C extends BaseElementClass>(Base: C): C {
			return class extends Base {
				static get styles() {
					return combineStyles(
						Base.styles,
						newStyles,
					)
				}
			}
		}
	}

	export function css_deferred(getNewStyles: () => (CSSResultGroup | undefined)[]) {
		return function<C extends BaseElementClass>(Base: C): C {
			return class extends Base {
				static get styles() {
					return combineStyles(
						Base.styles,
						getNewStyles(),
					)
				}
			}
		}
	}

	export function signals(signals: SignalTower) {
		return function<C extends BaseElementClass>(Base: C): C {
			return class extends Base {
				#lean: Lean | null = null

				render() {
					return this.#lean?.collect(() => super.render())
				}

				connectedCallback() {
					super.connectedCallback()
					this.#lean = signals.lean(() => this.requestUpdate())
				}

				disconnectedCallback() {
					super.disconnectedCallback()
					if (this.#lean) {
						this.#lean.stop()
						this.#lean = null
					}
				}
			}
		}
	}

	export function flat(flat: Flat) {
		return function<C extends BaseElementClass>(Base: C): C {
			return class extends Base {
				#lean: Lean | null = null

				render() {
					return this.#lean?.collect(() => super.render())
				}

				connectedCallback() {
					super.connectedCallback()
					this.#lean = flat.lean(() => this.requestUpdate())
				}

				disconnectedCallback() {
					super.disconnectedCallback()
					if (this.#lean) {
						this.#lean.stop()
						this.#lean = null
					}
				}
			}
		}
	}

	export function reactive(r = state.reactor) {
		return function<C extends BaseElementClass>(Base: C): C {
			return class extends Base {
				#lean: Lean | null = null

				render() {
					return this.#lean?.collect(() => super.render())
				}

				connectedCallback() {
					super.connectedCallback()
					this.#lean = r.lean(() => this.requestUpdate())
				}

				disconnectedCallback() {
					super.disconnectedCallback()
					if (this.#lean) {
						this.#lean.stop()
						this.#lean = null
					}
				}
			}
		}
	}

	/** @deprecated use `reactive` instead */
	export const reactor = reactive

	export function setup(...styles: CSSResultGroup[]) {
		return function<C extends BaseElementClass>(Base: C): C {
			return Pipe.with(Base)
				.to(css(...styles))
				.to(reactive())
				.done() as C
		}
	}
}

function arrayize<T>(item: T | T[]) {
	return <T[]>[item].flat().filter(i => !!i)
}

const notUndefined = (x: any) => x !== undefined

function combineStyles(
		parentStyles: CSSResultGroup | undefined,
		newStyles: (undefined | CSSResultGroup)[]
	) {

	const styles = [
		...(arrayize(parentStyles) ?? []),
		...arrayize(newStyles),
	]

	return styles
		.flat()
		.filter(notUndefined) as CSSResultGroup
}

