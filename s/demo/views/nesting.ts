
import {css} from "lit"
import {slate} from "../frontend.js"
import {html} from "../../nexus/html.js"

const styles = css`span { color: green }`

let outerRenders = 0
let innerRenders = 0

export const NestingOuter = slate.shadowView(use =>
	(start: number) => {

	use.styles(styles)

	const rendercount = ++outerRenders
	const count = use.signal(start)
	const increase = () => count.value += 1

	return html`
		<span>${count} (renders ${rendercount})</span>
		<button @click=${increase}>outer</button>
		${NestingInner([1])}
	`
})

export const NestingInner = slate.shadowView(use =>
	(start: number) => {

	use.styles(styles)

	const rendercount = ++innerRenders
	const count = use.signal(start)
	const increase = () => count.value += 1

	return html`
		<span>${count} (renders ${rendercount})</span>
		<button @click=${increase}>inner</button>
	`
})

