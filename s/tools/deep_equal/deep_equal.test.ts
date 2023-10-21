
import {Suite, expect} from "cynic"
import {deepEqual} from "./deep_equal.js"

export default <Suite>{

	async "compare primitive types"() {
		expect(deepEqual(123, 123)).equals(true)
		expect(deepEqual("abc", "abc")).equals(true)
		expect(deepEqual(true, true)).equals(true)
		expect(deepEqual(123, "123")).equals(false)
		expect(deepEqual(true, 1)).equals(false)
	},

	async "compare arrays"() {
		const array1 = [1, 2, 3]
		const array2 = [1, 2, 3]
		const array3 = [1, 2, 4]
		expect(deepEqual(array1, array2)).equals(true)
		expect(deepEqual(array1, array3)).equals(false)
	},

	async "compare plain objects"() {
		const obj1 = { foo: "bar", baz: 123 }
		const obj2 = { foo: "bar", baz: 123 }
		const obj3 = { foo: "bar", baz: 124 }
		expect(deepEqual(obj1, obj2)).equals(true)
		expect(deepEqual(obj1, obj3)).equals(false)
	},

	async "compare nested objects"() {
		const obj1 = { foo: "bar", inner: { baz: 123, deeper: { qux: true }}}
		const obj2 = { foo: "bar", inner: { baz: 123, deeper: { qux: true }}}
		const obj3 = { foo: "bar", inner: { baz: 124, deeper: { qux: true }}}
		expect(deepEqual(obj1, obj2)).equals(true)
		expect(deepEqual(obj1, obj3)).equals(false)
	},

	async "compare array of objects"() {
		const arr1 = [{ foo: "bar" }, { baz: 123 }, { qux: true }]
		const arr2 = [{ foo: "bar" }, { baz: 123 }, { qux: true }]
		const arr3 = [{ foo: "bar" }, { baz: 123 }, { qux: false }]
		expect(deepEqual(arr1, arr2)).equals(true)
		expect(deepEqual(arr1, arr3)).equals(false)
	},

	async "compare null and undefined"() {
		expect(deepEqual(null, null)).equals(true)
		expect(deepEqual(undefined, undefined)).equals(true)
		expect(deepEqual(null, undefined)).equals(false)
	},

	async "compare with nested arrays"() {
		const obj1 = { foo: "bar", array: [1, 2, [3, 4]] }
		const obj2 = { foo: "bar", array: [1, 2, [3, 4]] }
		const obj3 = { foo: "bar", array: [1, 2, [3, 5]] }
		expect(deepEqual(obj1, obj2)).equals(true)
		expect(deepEqual(obj1, obj3)).equals(false)
	}
}

