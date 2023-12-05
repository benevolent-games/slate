
import {is} from "../../is.js"

export const deepEqual = (alpha: any, bravo: any): boolean => {

	function recurse(alpha: any, bravo: any, parents: object[]) {
		if (!is.object(alpha) || !is.object(bravo))
			return alpha === bravo

		if (parents.includes(alpha))
			throw new Error(`forbidden circularity detected in deep equal comparison`)

		const newParents = [...parents, alpha]

		if (alpha instanceof Map && bravo instanceof Map) {
			if (alpha.size !== bravo.size)
				return false
			for (const [key, val] of alpha)
				if (!bravo.has(key) || !recurse(val, bravo.get(key), newParents))
					return false
		}
		else if (alpha instanceof Set && bravo instanceof Set) {
			if (alpha.size !== bravo.size)
				return false
			for (const item of alpha)
				if (!Array.from(bravo).some(bItem => recurse(item, bItem, newParents)))
					return false
		}
		else {
			const keys1 = Object.keys(alpha)
			const keys2 = Object.keys(bravo)

			if (keys1.length !== keys2.length)
				return false

			for (const key of keys1) {
				if (!keys2.includes(key))
					return false
				if (!recurse(alpha[key], bravo[key], newParents))
					return false
			}
		}

		return true
	}

	return recurse(alpha, bravo, [])
}

