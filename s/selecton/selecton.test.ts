
import {Suite, expect} from "cynic"
import {Selecton} from "./selecton.js"

export default <Suite>{
	"lol": async() => {
		const truth = new Selecton({
			count: 0,
			wrapper: {
				greeting: "hello",
			},
		})
		let calls = 0
		let lastCount: number | undefined
		truth.track(() => truth.state.count, count => {
			lastCount = count
			calls++
		})
		expect(lastCount).equals(undefined)
		truth.transmute(s => ({...s, count: 1}))
		expect(lastCount).equals(1)
		expect(calls).equals(1)
	},
}

