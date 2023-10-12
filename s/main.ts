
import {Context} from "./sketch.js"
import {components} from "./demo/frontend.js"
import {SlateCounter} from "./demo/elements/slate-counter.js"
import {register_to_dom} from "./base/helpers/register_to_dom.js"

register_to_dom(
	components(
		new Context(),
		{SlateCounter},
	)
)

console.log("slate")

