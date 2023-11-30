
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
		"tower can track multiple signals": async() => {
			const tower = new SignalTower()
			const alpha = tower.signal(0)
			const bravo = tower.signal(0)
			let calls = 0
			tower.reaction(
				() => {
					void alpha.value
					void bravo.value
				},
				() => calls++,
			)
			expect(calls).equals(0)
			alpha.value++
			await tower.wait
			expect(calls).equals(1)
			bravo.value++
			await tower.wait
			expect(calls).equals(2)
		},
		"tower can track signals progressively": async() => {
			const tower = new SignalTower()
			const alpha = tower.signal(0)
			const bravo = tower.signal(0)
			let calls = 0
			tower.reaction(
				() => {
					if (alpha.value > 0)
						void bravo.value
				},
				() => calls++,
			)
			expect(calls).equals(0)

			bravo.value++
			await tower.wait
			expect(calls).equals(0)

			alpha.value++
			await tower.wait
			expect(calls).equals(1)

			bravo.value++
			await tower.wait
			expect(calls).equals(2)
		},
		"tower can wait for ongoing publishing": async() => {
			const tower = new SignalTower()
			const count = tower.signal(0)
			let calls = 0
			tower.reaction(
				() => void count.value,
				() => calls++,
			)
			expect(calls).equals(0)
			count.value++
			await tower.wait
			expect(calls).equals(1)
		},
		"tower track passes payload": async() => {
			const tower = new SignalTower()
			const count = tower.signal(1)
			let reaction = 0
			tower.reaction(
				() => count.value * 2,
				doubled => reaction = doubled,
			)

			count.value = 5
			await tower.wait
			expect(reaction).equals(10)

			count.value = 10
			await tower.wait
			expect(reaction).equals(20)
		},
		"tower track with single argument syntax": async() => {
			const tower = new SignalTower()
			const count = tower.signal(0)
			let calls = 0
			tower.reaction(() => {
				void count.value
				calls++
			})
			expect(calls).equals(1)
			count.value++
			await tower.wait
			expect(calls).equals(2)
		},
		"computed values are updated": async() => {
			const tower = new SignalTower()
			const count = tower.signal(1)
			const doubled = tower.computed(() => count.value * 2)
			let count_calls = 0
			let doubled_calls = 0
			tower.reaction(() => {
				void count.value
				count_calls++
			})
			tower.reaction(() => {
				void doubled.value
				doubled_calls++
			})
			expect(count_calls).equals(1)
			expect(doubled_calls).equals(1)
			count.value = 5
			await tower.wait
			expect(count_calls).equals(2)
			expect(doubled_calls).equals(2)
			expect(doubled.value).equals(10)
		},
		"lean tracking": async() => {
			const tower = new SignalTower()
			const alpha = tower.signal(0)
			let collector_calls = 0
			let responder_calls = 0
			const collect = () => {
				void alpha.value
				collector_calls++
			}
			const lean = tower.lean(() => responder_calls++)

			expect(collector_calls).equals(0)
			expect(responder_calls).equals(0)

			lean.collect(collect)
			expect(collector_calls).equals(1)
			expect(responder_calls).equals(0)

			alpha.value++
			await tower.wait
			expect(collector_calls).equals(1)
			expect(responder_calls).equals(1)

			alpha.value++
			await tower.wait
			expect(collector_calls).equals(1)
			expect(responder_calls).equals(2)
		},
	},
}

