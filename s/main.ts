
import {css} from "lit"

import {SlateGold} from "./demo/elements/slate-gold.js"
import {SlateSilver} from "./demo/elements/slate-silver.js"
import {SlateCarbon} from "./demo/elements/slate-carbon.js"
import {SlateOxygen} from "./demo/elements/slate-oxygen.js"

import {DemoContext, slate} from "./demo/frontend.js"
import {register_to_dom} from "./base/helpers/register_to_dom.js"

slate.context = new DemoContext(css`
	button {
		font-weight: bold;
		color: red;
	}
`)

register_to_dom({
	SlateCarbon,
	SlateOxygen,
	...slate.components({
		SlateGold,
		SlateSilver,
	}),
})

