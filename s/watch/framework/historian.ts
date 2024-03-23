
import {Annals} from "./utils/annals.js"
import {History} from "./utils/history.js"
import {ZipAction} from "../zip/action.js"
import {StateTree} from "../state_tree.js"
import {watch} from "../../nexus/state.js"
import {ActionRecord} from "./utils/action_record.js"
import {history_actualize} from "./utils/actualize.js"
import {find_in_blueprint} from "./utils/find_in_blueprint.js"
import {record_snapshot, trim_to_history_limit} from "./utils/history_tools.js"

export class Historian<S, BP extends ZipAction.Blueprint<S>> {
	#annals: StateTree<Annals<S>>
	readonly actions: ZipAction.Callable<BP>
	readonly history: History<S>

	constructor(
			private tree: StateTree<S>,
			private blueprint: BP,
			private history_limit: number,
		) {

		this.#annals = watch.stateTree<Annals<S>>({
			snapshots: [],
			past: [],
			future: [],
		})

		this.actions = history_actualize({
			blueprint,
			tree,
			save_snapshot: this.save_snapshot.bind(this),
			proceed: this.proceed.bind(this),
		})

		this.history = new History(this.#annals, this)
	}

	save_snapshot() {
		this.#annals.transmute(annals => {
			record_snapshot(annals, this.tree.state, this.history_limit)
			return annals
		})
	}

	proceed(action: ActionRecord) {
		this.#annals.transmute(annals => {
			annals.past.push(action)
			trim_to_history_limit(annals.past, this.history_limit)
			annals.future = []
			return annals
		})
	}

	undo() {
		this.#annals.transmute(annals => {
			const {past, future, snapshots} = annals
			if (past.length > 0 && snapshots.length > 0) {
				const action = past.pop()!
				const previous_state = snapshots.pop()!
				future.push(action)
				this.tree.transmute(() => previous_state)
			}
			return annals
		})
	}

	redo() {
		this.#annals.transmute(annals => {
			const action = annals.future.pop()
			if (action) {
				const fn = find_in_blueprint(
					this.blueprint,
					action.purpose,
				) as ZipAction.Fn<S, any>

				if (!fn)
					throw new Error(`unknown action "${action.purpose}"`)

				this.tree.transmute(state => {
					record_snapshot(annals, state, this.history_limit)
					const setState = (newState: S) => { state = newState }
					fn(state, setState)(...action.params)
					return state
				})

				annals.past.push(action)
			}
			return annals
		})
	}
}

