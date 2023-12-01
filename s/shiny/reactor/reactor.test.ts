
import {Suite, expect} from "cynic"

import {Reactor} from "./reactor.js"
import {Flat} from "../../flatstate/flat.js"
import {SignalTower} from "../../signals/tower.js"

function setup() {
	return new Reactor(
		new Flat(),
		new SignalTower(),
	)
}

export default <Suite>{
	"reactor reacts to flatstate changes": async() => {
		const reactor = setup()
		const state = reactor.flat.state({alpha: 0})
		let calls = 0

		reactor.reaction(
			() => void state.alpha,
			() => calls++,
		)

		state.alpha++
		await reactor.wait
		expect(calls).equals(1)
	},
	"reactor reacts to signal changes": async() => {
		const reactor = setup()
		const bravo = reactor.signals.signal(0)
		let calls = 0

		reactor.reaction(
			() => void bravo.value,
			() => calls++,
		)

		bravo.value++
		await reactor.wait
		expect(calls).equals(1)
	},
	"flatstate and signal changes are debounced": async() => {
		const reactor = setup()
		const state = reactor.flat.state({alpha: 0})
		const bravo = reactor.signals.signal(0)
		let calls = 0

		reactor.reaction(
			() => void bravo.value,
			() => calls++,
		)

		state.alpha++
		bravo.value++
		await reactor.wait
		expect(calls).equals(1)
	},
}

