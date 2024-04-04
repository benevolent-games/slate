
export interface LitListener<E extends Event = Event> extends AddEventListenerOptions {
	handleEvent(e: E): void
}

export function litListener<E extends Event = Event>(o: LitListener<E>) {
	return o
}

