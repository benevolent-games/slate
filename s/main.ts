
import {Context} from "./sketch.js"
import {components} from "./demo/frontend.js"
import {SlateDoubler} from "./demo/elements/slate-doubler.js"
import {register_to_dom} from "./base/helpers/register_to_dom.js"
import {SlateGoldCounter} from "./demo/elements/slate-gold-counter.js"
import {SlateSilverSubtractor} from "./demo/elements/slate-silver-subtractor.js"

register_to_dom(
	components(
		new Context(),
		{
			SlateGoldCounter,
			SlateSilverSubtractor,
			SlateDoubler,
		},
	)
)

console.log("slate")

