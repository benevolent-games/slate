
import {ActionRecord} from "./action_record.js"

export interface Annals<S> {
	snapshots: S[]
	past: ActionRecord[]
	future: ActionRecord[]
}

