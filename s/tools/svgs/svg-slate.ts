
import {svg} from "lit"
import {TemplateParts} from "../templating.js"

export const svgSlate = (parts: TemplateParts) => svg(parts.strings, ...parts.values)

