
import {html} from "@benev/turtle"
import {TemplateParts} from "../template-string.js"

export const svgTurtle = (parts: TemplateParts) => html(parts.strings, ...parts.values)

