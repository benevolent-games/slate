
import {CSSResultGroup, TemplateResult} from "lit"

import {Use} from "./use.js"
import {Context} from "../context.js"
import {UseGold} from "./use_gold.js"
import {UseShadow} from "./use_shadow.js"
import {UseSilver} from "./use_silver.js"

export type QuartzRenderer<C extends Context, P extends any[]> = (
	(use: Use<C>) => (...props: P) => (TemplateResult | void)
)

export type ObsidianRenderer<C extends Context, P extends any[]> = (
	(use: UseShadow<C, HTMLElement>) => (...props: P) => (TemplateResult | void)
)

export type OxygenRenderer<C extends Context> = (
	(use: UseSilver<C>) => (TemplateResult | void)
)

export type CarbonRenderer<C extends Context> = (
	(use: UseGold<C>) => (TemplateResult | void)
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

