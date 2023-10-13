
import {CoreContext, prepare_quartz} from "../shiny/quartz.js"
import {BaseContext, prepare_frontend} from "../prepare/frontend.js"

export const context = new CoreContext()

export const {view, views, component, components} = prepare_frontend<BaseContext>()

export const quartz = prepare_quartz(context)

