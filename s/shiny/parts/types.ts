
import {Use} from "./use.js"
import {Context} from "../context.js"
import {CSSResultGroup, TemplateResult} from "lit"

export type QuartzFun<C extends Context, P extends any[]> = (
	(use: Use<C>) => (...props: P) => (TemplateResult | void)
)

export type ObsidianAttributes = Partial<{
	class: string
	part: string
	gpart: string
	exportparts: string
}> & {[key: string]: string}

export type ObsidianMeta = Partial<{
	content: TemplateResult
	auto_exportparts: boolean
	attributes: ObsidianAttributes
}>

export type ObsidianInput<P extends any[]> = {
	meta: ObsidianMeta
	props: P
}

export type ObsidianSettings = {
	name?: string
	styles?: CSSResultGroup
	auto_exportparts?: boolean
}

