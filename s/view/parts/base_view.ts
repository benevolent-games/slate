
import {TemplateResult} from "lit"

export abstract class BaseView {
	abstract render(...props: any[]): TemplateResult | void
}

