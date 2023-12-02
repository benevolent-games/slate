
import {Collector, Responder} from "../../reactor/types.js"

export type Fn = () => void
export type KeySet = Set<string>
export type Recording = Map<{}, KeySet>

export type NormalReaction<P> = {
	collector: Collector<P>
	responder: Responder<P> | void
}

export type LeanReaction = {
	lean: true
	actor: () => void
}

export type Reaction<P> = NormalReaction<P> | LeanReaction

export type SymbolMap = Map<symbol, Reaction<any>>
export type KeyMap = Map<string, SymbolMap>
export type Tracking = WeakMap<{}, KeyMap>

