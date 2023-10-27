
import {css} from "lit"

import {SlateGold} from "./demo/elements/slate-gold.js"
import {SlateSilver} from "./demo/elements/slate-silver.js"
import {SlateCarbon} from "./demo/elements/slate-carbon.js"
import {SlateOxygen} from "./demo/elements/slate-oxygen.js"

import {apply} from "./base/helpers/apply.js"
import {DemoContext, set_context} from "./demo/frontend.js"
import {register_to_dom} from "./base/helpers/register_to_dom.js"

const context = new DemoContext(css`
	button {
		font-weight: bold;
		color: red;
	}
`)

set_context(context)

register_to_dom({
	SlateCarbon,
	SlateOxygen,
	...apply.context(context)({
		SlateGold,
		SlateSilver,
	}),
})

