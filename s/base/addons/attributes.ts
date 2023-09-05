
import {BaseElement} from "../element.js"
import {ShaleView} from "../../view/shale.js"

type AttrStrings = {[key: string]: string}

export class Attributes<A extends AttrStrings> {

	static on_change(element: HTMLElement, on_change: () => void) {
		const observer = new MutationObserver(on_change)
		observer.observe(element, {attributes: true})
		return () => observer.disconnect()
	}

	static create<A extends AttrStrings>(element: HTMLElement, on_change: () => void) {
		this.on_change(element, on_change)
		return new this<A>(element)
	}

	static base<A extends AttrStrings>(element: BaseElement) {
		return this.create<A>(element, () => element.requestUpdate())
	}

	static view<A extends AttrStrings>(view: ShaleView) {
		return this.create<A>(view.element, () => view.requestUpdate())
	}

	static setup<A extends AttrStrings>(target: BaseElement | ShaleView) {
		return (target instanceof ShaleView)
			? this.view<A>(target)
			: this.base<A>(target)
	}

	#element: HTMLElement

	constructor(element: HTMLElement) {
		this.#element = element
	}

	#setty(name: string, str: string | void) {
		if (str === undefined || str === null)
			this.#element.removeAttribute(name)
		else
			this.#element.setAttribute(name, str)
	}

	string = ezproxy<string>({
		read: name => this.#element.getAttribute(name) ?? undefined,
		write: (name, str) => this.#setty(name, str),
	}) as AttrFor<string, A>

	number = ezproxy<number>({
		read: name => Number(this.#element.getAttribute(name) ?? 0),
		write: (name, num) => this.#setty(name, num?.toString()),
	}) as AttrFor<number, A>

	boolean = ezproxy<boolean>({
		read: name => this.#element.hasAttribute(name),
		write: (name, bool) => {
			if (bool)
				this.#element.setAttribute(name, "")
			else
				this.#element.removeAttribute(name)
		},
	}) as AttrFor<boolean, A>
}

type AttrFor<T, A> = {[P in keyof A]: T}

function ezproxy<T>({read, write}: {
		read: (name: string) => T | undefined,
		write: (name: string, value: T | void) => void,
	}) {

	return new Proxy({}, {
		get: (_, name: string) => read(name),
		set: (_, name: string, value: T | void) => {
			write(name, value)
			return true
		},
	})
}

