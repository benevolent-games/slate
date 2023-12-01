
export type Collector<P> = () => P
export type Responder<P> = (payload: P) => void

export type Lean = {
	stop: () => void
	collect: <P>(collector: Collector<P>) => P
}

export interface ReactorCore {
	reaction<P>(
		collector: Collector<P>,
		responder?: Responder<P>,
	): () => void

	lean(actor: () => void): Lean
}

