
import {TemplateResult} from "lit"
import {DirectiveResult} from "lit/async-directive.js"

import {Context} from "../context.js"
import {UseShadowComponent, UseShadowView, UseLightComponent, UseLightView} from "./use/tailored.js"

export type RenderResult = TemplateResult | DirectiveResult | string | null | undefined | void
export type Content = TemplateResult | DirectiveResult | HTMLElement | string | null | undefined | void

export type LightViewRenderer<C extends Context, P extends any[]> = (
	(use: UseLightView<C>) => (...props: P) => RenderResult
)

export type ShadowViewRenderer<C extends Context, P extends any[]> = (
	(use: UseShadowView<C, HTMLElement>) => (...props: P) => RenderResult
)

export type LightComponentRenderer<C extends Context> = (
	(use: UseLightComponent<C>) => RenderResult
)

export type ShadowComponentRenderer<C extends Context> = (
	(use: UseShadowComponent<C>) => RenderResult
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

