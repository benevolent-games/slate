
import {Suite} from "cynic"

import clone from "./tools/clone/clone.test.js"
import signals from "./signals/signals.test.js"
import flatstate from "./flatstate/flat.test.js"
import debounce from "./tools/debounce/debounce.test.js"
import watch from "./watch/watch.test.js"
import zipAction from "./watch/zip/action.test.js"
import reactor from "./reactor/reactor.test.js"
import deep from "./tools/deep/deep.test.js"

export default <Suite>{
	clone,
	signals,
	debounce,
	flatstate,
	deep,
	watch,
	zipAction,
	reactor,
}

