
import {pub} from "../../tools/pub.js"
import {register_to_dom} from "../../base/helpers/register_to_dom.js"

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

register_to_dom({SlateView}, {soft: true})

