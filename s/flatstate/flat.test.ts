
import {Suite, expect} from "cynic"
import {Flat} from "./flat.js"

export default <Suite>{

	async "increment state count"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		expect(state.count).equals(0)
		state.count += 1
		expect(state.count).equals(1)
	},

	async "react to change"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		const c = Flat.collectivize(state)
		let calls = false
		flat.reaction(
			c(({count}) => ({count})),
			() => { calls = true },
		)
		expect(calls).equals(false)
		expect(state.count).equals(0)
		state.count = 123
		await flat.wait
		expect(state.count).equals(123)
		expect(calls).equals(true)
	},

	async "react to changes from two states"() {
		const flat = new Flat()
		const stateA = flat.state({alpha: 0})
		const stateB = flat.state({bravo: 0})
		const c = Flat.collectivize(() => ({...stateA, ...stateB}))
		let calls = 0
		flat.reaction(
			c(({alpha, bravo}) => ({alpha, bravo})),
			() => calls++,
		)
		calls = 0

		stateA.alpha++
		await flat.wait
		expect(calls).equals(1)

		stateB.bravo++
		await flat.wait
		expect(calls).equals(2)
	},

	async "reaction with only one function"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		let called = false
		flat.reaction(() => {
			void state.count
			called = true
		})
		expect(called).equals(true)
		expect(state.count).equals(0)
		called = false
		state.count = 123
		await flat.wait
		expect(state.count).equals(123)
		expect(called).equals(true)
	},

	async "reaction collector can pass data to responder"() {
		const flat = new Flat()
		const state = flat.state({count: 0, greeting: "hello"})
		let a: number = -1
		let b: string = ""
		flat.reaction(
			() => ({count: state.count, greeting: state.greeting}),
			({count, greeting}) => {
				a = count
				b = greeting
			},
		)
		expect(a).equals(-1)
		expect(b).equals("")
		state.count++
		state.greeting = "hello world"
		await flat.wait
		expect(a).equals(1)
		expect(b).equals("hello world")
	},

	async "manual can be efficient"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		let collect = false
		let respond = false
		flat.manual({
			debounce: true,
			discover: false,
			collector: () => {
				void state.count
				collect = true
			},
			responder: () => {
				void state.count
				respond = true
			},
		})
		expect(collect).equals(true)
		expect(respond).equals(false)
		collect = false
		respond = false
		state.count++
		await flat.wait
		expect(collect).equals(false)
		expect(respond).equals(true)
	},

	async "efficient discovery"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		let collect = 0
		let respond = 0
		flat.manual({
			debounce: true,
			discover: true,
			collector: () => {
				void state.count
				collect++
			},
			responder: () => {
				respond++
			},
		})
		expect(collect).equals(1)
		expect(respond).equals(0)
		state.count++
		await flat.wait
		expect(collect).equals(2)
		expect(respond).equals(1)
	},

	async "circular loops are forbidden"() {
		const settings = {debounce: true, discover: false}

		await expect(async() => {
			const flat = new Flat()
			const state = flat.state({count: 0})
			flat.manual({
				...settings,
				collector: () => {
					state.count = 123
					return {count: state.count}
				},
				responder: () => {},
			})
			await flat.wait
		}).throws()

		await expect(async() => {
			const flat = new Flat()
			const state = flat.state({count: 0})
			flat.manual({
				...settings,
				collector: () => ({count: state.count}),
				responder: () => { state.count = 123 },
			})
			state.count++
			await flat.wait
		}).throws()

		await expect(async() => {
			const flat = new Flat()
			const state = flat.state({count: 0})
			flat.reaction(() => state.count = 123)
			await flat.wait
		}).throws()
	},

	async "stop a reaction"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		let called = false
		const stop = flat.reaction(() => {
			void state.count
			called = true
		})

		called = false
		state.count++
		await flat.wait
		expect(called).equals(true)

		called = false
		stop()
		state.count++
		await flat.wait
		expect(called).equals(false)
	},

	async "debounce multiple changes"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		const state2 = flat.state({count: 0})
		let a = 0
		let b = 0
		let c = 0
		flat.manual({
			debounce: true,
			discover: false,
			collector: () => void state.count,
			responder: () => a++,
		})
		flat.manual({
			debounce: true,
			discover: false,
			collector: () => void state.count,
			responder: () => b++,
		})
		flat.manual({
			debounce: true,
			discover: false,
			collector: () => { void state2.count; void state2.count },
			responder: () => c++,
		})
		state.count++
		state.count++
		state.count++
		state2.count++
		state2.count++
		state2.count++
		await flat.wait
		expect(a).equals(1)
		expect(b).equals(1)
		expect(c).equals(1)
	},

	async "discovery of new nested states"() {
		const flat = new Flat()
		const outer = flat.state({
			inner: undefined as (undefined | {count: number})
		})
		let last_count: undefined | number
		flat.deepReaction(() => {
			last_count = outer.inner?.count
		})
		expect(last_count).equals(undefined)
		outer.inner = flat.state({count: 0})
		await flat.wait
		expect(last_count).equals(0)
		outer.inner.count++
		await flat.wait
		expect(last_count).equals(1)
	},

	async "reactions are isolated"() {
		const flatA = new Flat()
		const stateA1 = flatA.state({count: 0})
		const stateA2 = flatA.state({count: 0})

		const flatB = new Flat()
		const stateB1 = flatB.state({count: 0})
		const stateB2 = flatB.state({count: 0})

		const reactions = {
			A1: false,
			A2: false,
			B1: false,
			B2: false,
		}

		flatA.reaction(() => { void stateA1.count; reactions.A1 = true })
		flatA.reaction(() => { void stateA2.count; reactions.A2 = true })

		flatB.reaction(() => { void stateB1.count; reactions.B1 = true })
		flatB.reaction(() => { void stateB2.count; reactions.B2 = true })

		reactions.A1 = false
		reactions.A2 = false
		reactions.B1 = false
		reactions.B2 = false

		stateA1.count++
		await Promise.all([flatA.wait, flatB.wait])
		expect(reactions.A1).equals(true)
		expect(reactions.A2).equals(false)
		expect(reactions.B1).equals(false)
		expect(reactions.B2).equals(false)

		stateB1.count++
		await Promise.all([flatA.wait, flatB.wait])
		expect(reactions.A1).equals(true)
		expect(reactions.A2).equals(false)
		expect(reactions.B1).equals(true)
		expect(reactions.B2).equals(false)
	},

	async "readonly works with reactions"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		const rstate = Flat.readonly(state)
		let called = false
		flat.reaction(() => {
			void rstate.count
			called = true
		})
		expect(called).equals(true)
		called = false
		state.count++
		await flat.wait
		expect(called).equals(true)
	},

	async "readonly throws errors on writes"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		const rstate = Flat.readonly(state)
		expect(() => { state.count++ }).not.throws()
		expect(() => { rstate.count++ }).throws()
	},

	async "clear all reactions"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		let called = false
		flat.reaction(() => { void state.count; called = true })

		called = false
		state.count++
		await flat.wait
		expect(called).equals(true)

		called = false
		flat.clear()
		state.count++
		await flat.wait
		expect(called).equals(false)
	},

	async "nested states"() {
		const flat = new Flat()
		const outer = flat.state({
			count: 0,
			inner: flat.state({count: 0})
		})
		let outer_called = false
		let inner_called = false
		flat.reaction(() => {
			void outer.count
			outer_called = true
		})
		flat.reaction(() => {
			void outer.inner.count
			inner_called = true
		})
		expect(outer_called).equals(true)
		expect(inner_called).equals(true)

		outer_called = false
		inner_called = false
		outer.count++
		await flat.wait
		expect(outer_called).equals(true)
		expect(inner_called).equals(false)

		outer_called = false
		inner_called = false
		outer.inner.count++
		await flat.wait
		expect(outer_called).equals(false)
		expect(inner_called).equals(true)
	},

	async "discovery without debounce"() {
		const flat = new Flat()
		const state = flat.state({count: 0})
		let calls = 0
		flat.manual({
			discover: true,
			debounce: false,
			collector: () => { void state.count },
			responder: () => {
				if (calls++ > 10)
					throw new Error("loop")
			},
		})
		state.count++
		await flat.wait
	},

}

