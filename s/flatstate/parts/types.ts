
export type Fn = () => void
export type KeySet = Set<string>
export type Recording = Map<{}, KeySet>

export type Collector<P> = () => P
export type Responder<P> = (payload: P) => void

export type NormalReaction<P> = {
	collector: Collector<P>
	responder: Responder<P> | void
}

export type LeanReaction = {
	lean: true
	responder: () => void
}

export type Reaction<P> = NormalReaction<P> | LeanReaction

export type SymbolMap = Map<symbol, Reaction<any>>
export type KeyMap = Map<string, SymbolMap>
export type Tracking = WeakMap<{}, KeyMap>

export type Lean = {
	stop: () => void
	collect: <P>(collector: Collector<P>) => P
}

