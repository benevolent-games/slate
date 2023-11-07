
import {Suite, expect} from "cynic"
import {ZipAction} from "./action.js"
import {StateTree} from "../state_tree.js"

export default <Suite>{
	"actions work": async() => {
		let memory = 0

		type State = {test: {count: number}}
		const group = ZipAction.group<State>()

		const tree = new StateTree<State>(
			{test: {count: 0}},
			() => { memory = tree.state.test.count },
		)

		const counting_specs = group({
			wrapper: {
				add: state => (n: number) => {
					state.test.count += n
				},
				reset: (_state, setRoot) => () => {
					setRoot({test: {count: 0}})
				},
			},
		})

		const counting = ZipAction.actualize(tree, counting_specs)

		expect(tree.state.test.count).equals(0)
		expect(memory).equals(0)

		counting.wrapper.add(1)
		counting.wrapper.add(2)
		expect(tree.state.test.count).equals(3)
		expect(memory).equals(3)

		counting.wrapper.reset()
		expect(tree.state.test.count).equals(0)
		expect(memory).equals(0)
	},
}

