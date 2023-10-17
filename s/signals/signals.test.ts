
import {Suite, expect} from "cynic"

import {Signal} from "./signal.js"
import {SignalTower} from "./tower.js"

export default <Suite>{
	"standalone signals": {
		"we can change a value": async() => {
			const signal = new Signal(0)
			expect(signal.value).equals(0)

			signal.value++
			expect(signal.value).equals(1)

			signal.value++
			expect(signal.value).equals(2)
		},
		"we can subscribe to a signal": async() => {
			const signal = new Signal(0)
			let calls = 0
			signal.subscribe(() => calls++)
			signal.value++
			await signal.wait
			expect(calls).equals(1)
		},
		"we can stop a subscription": async() => {
			const signal = new Signal(0)
			let calls = 0
			const untrack = signal.subscribe(() => calls++)

			signal.value++
			await signal.wait
			expect(calls).equals(1)

			untrack()
			signal.value++
			await signal.wait
			expect(calls).equals(1)
		},
		"changes to signal values are debounced": async() => {
			const signal = new Signal(0)
			let calls = 0
			signal.subscribe(() => calls++)
			signal.value++
			signal.value++
			await signal.wait
			expect(calls).equals(1)
		},
		"we can wait for debounced signals": async() => {
			const signal = new Signal(0)
			let calls = 0
			signal.subscribe(() => calls++)
			signal.value++
			signal.value++
			expect(calls).equals(0)
			await signal.wait
			expect(calls).equals(1)
		},
	},
	"signal tower": {
		"tower can wait for ongoing publishing": async() => {
			const tower = new SignalTower()
			const count = tower.signal(0)
			let calls = 0
			tower.track(
				() => void count.value,
				() => calls++,
			)
			expect(calls).equals(0)
			count.value++
			await tower.wait
			expect(calls).equals(1)
		},
		"tower track with single argument syntax": async() => {
			const tower = new SignalTower()
			const count = tower.signal(0)
			let calls = 0
			tower.track(() => {
				void count.value
				calls++
			})
			expect(calls).equals(1)
			count.value++
			await tower.wait
			expect(calls).equals(2)
		},
	},
}

