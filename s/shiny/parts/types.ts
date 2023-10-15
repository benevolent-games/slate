
import {CSSResultGroup, TemplateResult} from "lit"

import {Context} from "../context.js"
import {UseCarbon, UseObsidian, UseOxygen, UseQuartz} from "./use/tailored.js"

export type QuartzRenderer<C extends Context, P extends any[]> = (
	(use: UseQuartz<C>) => (...props: P) => (TemplateResult | void)
)

export type ObsidianRenderer<C extends Context, P extends any[]> = (
	(use: UseObsidian<C, HTMLElement>) => (...props: P) => (TemplateResult | void)
)

export type OxygenRenderer<C extends Context> = (
	(use: UseOxygen<C>) => (TemplateResult | void)
)

export type CarbonRenderer<C extends Context> = (
	(use: UseCarbon<C>) => (TemplateResult | void)
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

