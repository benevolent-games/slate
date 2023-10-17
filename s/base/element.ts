
import {CSSResultGroup, TemplateResult} from "lit"

export type BaseElement = HTMLElement & {
	connectedCallback(): void
	disconnectedCallback(): void
	requestUpdate(): void
	readonly updateComplete: Promise<boolean>
	render(): TemplateResult | void
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

