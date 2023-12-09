
export interface FancyEventListener<E extends Event> extends AddEventListenerOptions {
	handleEvent(e: E): void
}

