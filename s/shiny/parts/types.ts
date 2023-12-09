
import {TemplateResult} from "lit"
import {DirectiveResult} from "lit/async-directive.js"

import {Context} from "../context.js"
import {UseCarbon, UseObsidian, UseOxygen, UseQuartz} from "./use/tailored.js"

export type LightViewRenderer<C extends Context, P extends any[]> = (
	(use: UseQuartz<C>) => (...props: P) => (TemplateResult | void)
)

export type ShadowViewRenderer<C extends Context, P extends any[]> = (
	(use: UseObsidian<C, HTMLElement>) => (...props: P) => (TemplateResult | void)
)

export type LightComponentRenderer<C extends Context> = (
	(use: UseOxygen<C>) => (TemplateResult | void)
)

export type ShadowComponentRenderer<C extends Context> = (
	(use: UseCarbon<C>) => (TemplateResult | void)
)

export type LightView<P extends any[]> = (
	(...props: P) => DirectiveResult<any>
)

export type ShadowView<P extends any[]> = (
	(props: P, meta?: ShadowViewMeta) => DirectiveResult<any>
)

export type ShadowAttrs = Partial<{
	class: string
	part: string
	gpart: string
	exportparts: string
}> & {[key: string]: string}

export type ShadowViewMeta = Partial<{
	content: TemplateResult
	auto_exportparts: boolean
	attrs: ShadowAttrs
}>

export type ShadowViewInput<P extends any[]> = {
	meta: ShadowViewMeta
	props: P
}

