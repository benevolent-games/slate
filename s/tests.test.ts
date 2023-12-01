
import {Suite} from "cynic"
import clone from "./tools/clone/clone.test.js"
import signals from "./signals/signals.test.js"
import flatstate from "./flatstate/flat.test.js"
import debounce from "./tools/debounce/debounce.test.js"
import deepEqual from "./tools/deep_equal/deep_equal.test.js"
import watch from "./watch/watch.test.js"
import zipAction from "./watch/zip/action.test.js"
import reactor from "./shiny/reactor/reactor.test.js"

export default <Suite>{
	clone,
	signals,
	debounce,
	flatstate,
	deepEqual,
	watch,
	zipAction,
	reactor,
}

