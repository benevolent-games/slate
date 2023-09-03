
export type Fun = () => void
export type KeySet = Set<string>
export type Recording = Map<{}, KeySet>

export type Reaction = {
	collector: Fun
	responder: Fun
	discover: boolean
	debounce: boolean
}

export type SymbolMap = Map<symbol, Reaction>
export type KeyMap = Map<string, SymbolMap>
export type Tracking = WeakMap<{}, KeyMap>

