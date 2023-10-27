
import {CSSResultGroup, TemplateResult} from "lit"

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

	export function signals(tower: SignalTower) {
		return function<C extends BaseElementClass>(Base: C): C {
			return class extends Base {
				#untracks: (() => void)[] = []

				connectedCallback() {
					super.connectedCallback()

					this.#untracks.push(tower.track(
						() => this.render(),
						() => this.requestUpdate(),
					))
				}

				disconnectedCallback() {
					super.disconnectedCallback()

					for (const untrack of this.#untracks)
						untrack()

					this.#untracks = []
				}
			}
		}
	}

	/*

	this flatstate mixin uses a bizarre strategy for optimizaton purposes.

	+ on every render, we stop/reassign a new manual reaction.
	+ discover is false, because we essentially emulate it
		by assigning a new reaction every render,
		using the current render as a new collector.
	+ debounce is false, because lit's requestUpdate does that.

	*/
	export function flat(flat: Flat) {
		return function<C extends BaseElementClass>(Base: C): C {
			return class extends Base {
				#stop: void | (() => void) = undefined

				render() {
					if (this.#stop)
						this.#stop()

					let result: void | TemplateResult = undefined

					this.#stop = flat.manual({
						debounce: false,
						discover: false,
						collector: () => {
							result = super.render()
						},
						responder: () => {
							this.requestUpdate()
						},
					})

					return result
				}

				disconnectedCallback() {
					super.disconnectedCallback()

					if (this.#stop)
						this.#stop()

					this.#stop = undefined
				}
			}
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

