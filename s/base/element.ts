
import {CSSResultGroup, TemplateResult} from "lit"

export type BaseElement = HTMLElement & {
	connectedCallback(): void
	disconnectedCallback(): void
	render(): TemplateResult | void
	requestUpdate(): Promise<void>
	readonly updateComplete: Promise<void>
}

export type BaseElementClass = {
	new(...args: any[]): BaseElement
	styles?: CSSResultGroup
}

export type HTMLElementClasses = {
	[key: string]: {new(...args: any[]): HTMLElement}
}

export type BaseElementClasses = {
	[key: string]: BaseElementClass
}

