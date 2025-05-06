
import {pub} from "../../tools/pub.js"

export class SlateView extends HTMLElement {
	static tag = "slate-view"

	onConnected = pub<void>()
	onDisconnected = pub<void>()

	connectedCallback() {
		this.onConnected.publish()
	}

	disconnectedCallback() {
		this.onDisconnected.publish()
	}
}

