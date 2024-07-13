
import {clone} from "../clone/clone.js"
import {deepEqual} from "./parts/equal.js"
import {deepFreeze} from "./parts/freeze.js"

export const deep = {
	clone,
	equal: deepEqual,
	freeze: deepFreeze,
}

