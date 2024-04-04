
import {CSSResultGroup} from "lit"
import {RenderResult} from "../nexus/parts/types.js"

export type BaseElement = HTMLElement & {
	connectedCallback(): void
	disconnectedCallback(): void
	requestUpdate(): void
	readonly updateComplete: Promise<boolean>
	render(): RenderResult
}

export type BaseElementClass = {
	new(...args: any[]): BaseElement
	readonly styles?: CSSResultGroup
}

export type HTMLElementClasses = {
	[key: string]: {new(...args: any[]): HTMLElement}
}

export type BaseElementClasses = {
	[key: string]: BaseElementClass
}

