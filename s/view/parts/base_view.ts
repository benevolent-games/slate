
import {TemplateResult} from "lit"
import {mixinSetups} from "../../element/part/mixin_setups.js"

export abstract class BaseView extends mixinSetups(class {}) {
	abstract render(...props: any[]): TemplateResult | void
}

