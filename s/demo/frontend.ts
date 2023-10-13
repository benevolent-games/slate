
import {css} from "lit"
import {Flat} from "../flatstate/flat.js"
import {BaseContext, prepare_frontend} from "../prepare/frontend.js"
import { quartz } from "../view/quartz.js"

export class Context implements BaseContext {
	theme = css``
	flat = new Flat()
}

export const context = new Context()

export const {view, views, component, components} = prepare_frontend<Context>()

export const quartzview = quartz(context)

