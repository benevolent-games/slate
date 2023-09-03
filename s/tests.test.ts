
import {Suite} from "cynic"
import clone from "./tools/clone/clone.test.js"
import flatstate from "./flatstate/flat.test.js"
import debounce from "./tools/debounce/debounce.test.js"

export default <Suite>{
	clone,
	debounce,
	flatstate,
}

