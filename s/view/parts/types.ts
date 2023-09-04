
import {CSSResultGroup, TemplateResult} from "lit"

import {ViewUse} from "./use.js"
import {Flat} from "../../flatstate/flat.js"

export type ViewAttributes = {
	[key: string]: string | number | boolean | undefined
}

export type ViewSettings = {
	class?: string
	part?: string
	gpart?: string
	attributes?: ViewAttributes
	auto_exportparts?: boolean
}

export type ViewInputs<P extends any[]> = ViewSettings & {
	props: P
	attributes?: ViewAttributes
	content?: TemplateResult | void
}

export type ViewHooksRenderer<P extends any[]> = (
	(use: ViewUse) => (...props: P) => (TemplateResult | void)
)

export type ViewHooks<P extends any[]> = {
	flat: Flat
	name: string
	styles: CSSResultGroup
	default_auto_exportparts: boolean
	render: ViewHooksRenderer<P>
}

export type View<P extends any[]> = (data: ViewInputs<P>) => (TemplateResult | void)

export type ViewHooksSetupDetails<R> = {
	result: R
	setdown: () => void
}

export type ViewHooksSetup<R> = () => ViewHooksSetupDetails<R>

