
import {pub} from "../../tools/pub.js"
import {register_to_dom} from "../../base/helpers/register_to_dom.js"

export class ObsidianView extends HTMLElement {
	static tag = "obsidian-view"

	onConnected = pub<void>()
	onDisconnected = pub<void>()

	connectedCallback() {
		this.onConnected.publish()
	}
	disconnectedCallback() {
		this.onDisconnected.publish()
	}
}

register_to_dom({ObsidianView})

