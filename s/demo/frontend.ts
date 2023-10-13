
import {Context} from "../shiny/context.js"
import {prepare_frontend} from "../shiny/frontend.js"
import {BaseContext, prepare_frontend as old_prepare_frontend} from "../prepare/frontend.js"

export const {quartz, obsidian} = prepare_frontend(new Context())

export const {view, views, component, components} = old_prepare_frontend<BaseContext>()

