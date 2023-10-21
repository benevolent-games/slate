
import {Suite, expect} from "cynic"
import {WatchTower} from "./watch_tower.js"

function setup() {
	const watch = new WatchTower()
	const tree = watch.stateTree({
		count: 0,
		group: {
			greeting: "hello",
			active: false,
		},
	})
	return {watch, tree}
}

export default <Suite>{
	"we can read state": async() => {
		const {tree} = setup()
		expect(tree.state.count).equals(0)
		expect(tree.state.group.greeting).equals("hello")
	},
	"we can change state via transmute": async() => {
		const {tree} = setup()
		expect(tree.state.count).equals(0)
		tree.transmute(state => {
			state.count++
			state.group.greeting = "bonjour"
			return state
		})
		expect(tree.state.count).equals(1)
		expect(tree.state.group.greeting).equals("bonjour")
	},
	"we cannot change state outside transmute": async() => {
		const {tree} = setup()
		expect(tree.state.count).equals(0)
		expect(() => {
			tree.state.count++
		}).throws()
		expect(tree.state.count).equals(0)
	},
	"we can track changes to state": async() => {
		const {watch, tree} = setup()
		let calls = 0
		let lastCount = 0
		watch.track(
			() => tree.state.count,
			count => {
				calls++
				lastCount = count
			},
		)
		expect(calls).equals(1)
		expect(lastCount).equals(0)
		tree.transmute(state => {
			state.count++
			return state
		})
		expect(calls).equals(2)
		expect(lastCount).equals(1)
	},
	"we can track changes to specific state": async() => {
		const {watch, tree} = setup()
		let updates_for_count = 0
		let updates_for_greeting = 0
		let updates_for_active = 0
		let updates_for_group = 0

		watch.track(
			() => tree.state.count,
			() => { updates_for_count++ },
		)
		watch.track(
			() => tree.state.group.greeting,
			() => { updates_for_greeting++ },
		)
		watch.track(
			() => tree.state.group.active,
			() => { updates_for_active++ },
		)
		watch.track(
			() => tree.state.group,
			() => { updates_for_group++ },
		)

		function reset_counters() {
			updates_for_count = 0
			updates_for_greeting = 0
			updates_for_active = 0
			updates_for_group = 0
		}

		reset_counters()
		tree.transmute(state => {
			state.count++
			return state
		})
		expect(updates_for_count).equals(1)
		expect(updates_for_greeting).equals(0)
		expect(updates_for_active).equals(0)
		expect(updates_for_group).equals(0)

		reset_counters()
		tree.transmute(state => {
			state.group.greeting = "bonjour"
			return state
		})
		expect(updates_for_count).equals(0)
		expect(updates_for_greeting).equals(1)
		expect(updates_for_active).equals(0)
		expect(updates_for_group).equals(1)

		reset_counters()
		tree.transmute(state => {
			state.group.active = true
			return state
		})
		expect(updates_for_count).equals(0)
		expect(updates_for_greeting).equals(0)
		expect(updates_for_active).equals(1)
		expect(updates_for_group).equals(1)
	},
	"we can make slices of the state": async() => {
		const {tree, watch} = setup()
		let calls_alpha = 0
		watch.track(
			() => tree.state.group.greeting,
			() => { calls_alpha++ },
		)
		expect(calls_alpha).equals(1)
		const slice = tree.slice({
			getter: (state) => state.group,
			setter: (state, group) => {
				state.group = group
				return state
			},
		})
		let calls_bravo = 0
		watch.track(
			() => slice.state.greeting,
			() => { calls_bravo++ },
		)
		expect(calls_bravo).equals(1)
		slice.transmute(state => {
			state.greeting = "bonjour"
			return state
		})
		expect(calls_alpha).equals(2)
		expect(calls_bravo).equals(2)
		tree.transmute(state => {
			state.group.greeting = "hola"
			return state
		})
		expect(calls_alpha).equals(3)
		expect(calls_bravo).equals(3)
	},
}

