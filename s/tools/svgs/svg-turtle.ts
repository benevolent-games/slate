
import {html} from "@benev/turtle"
import {TemplateParts} from "../templating.js"

export const svgTurtle = (parts: TemplateParts) => html(parts.strings, ...parts.values)

