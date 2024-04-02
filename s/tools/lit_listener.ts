
export interface LitListener<E extends Event> extends AddEventListenerOptions {
	handleEvent(e: E): void
}

export function litListener<E extends Event>(o: LitListener<E>) {
	return o
}

