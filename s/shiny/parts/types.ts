
import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./use.js"
import {Context} from "../context.js"
import {UseLight} from "./use_light.js"
import {UseShadow} from "./use_shadow.js"

export type ViewRenderer<C extends Context, P extends any[]> = (
	(use: Use<C>) => (...props: P) => (TemplateResult | void)
)

export type LightRenderer<C extends Context> = (
	(use: UseLight<C>) => (TemplateResult | void)
)

export type ShadowRenderer<C extends Context> = (
	(use: UseShadow<C>) => (TemplateResult | void)
)

export type ShadowAttrs = Partial<{
	class: string
	part: string
	gpart: string
	exportparts: string
}> & {[key: string]: string}

export type ObsidianMeta = Partial<{
	content: TemplateResult
	auto_exportparts: boolean
	attrs: ShadowAttrs
}>

export type ObsidianInput<P extends any[]> = {
	meta: ObsidianMeta
	props: P
}

export type ShadowSettings = {
	name?: string
	styles?: CSSResultGroup
	auto_exportparts?: boolean
}

