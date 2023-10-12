
import {css} from "lit"
import {Flat} from "../flatstate/flat.js"
import {BaseContext, prepare_frontend} from "../prepare/frontend.js"

export class Context implements BaseContext {
	theme = css``
	flat = new Flat()
}

export const {view, views, component, components} = prepare_frontend<Context>()

