
import {slate} from "../frontend.js"
import {html} from "../../nexus/html.js"

export const QuartzTripler = slate.light_view(use => (start: number) => {
	use.name("quartz-tripler")

	// react hooks state
	const [alpha, setAlpha] = use.state(start)
	const increaseAlpha = () => setAlpha(alpha * 3)

	// flatstate
	const bravo = use.flatstate({count: start})
	const increaseBravo = () => bravo.count *= 3

	// preact signals
	const charlie = use.signal(start)
	const increaseCharlie = () => charlie.value *= 3

	return html`
		<span>${alpha}</span>
		<button @click=${increaseAlpha}>quartz-a</button>

		<span>${bravo.count}</span>
		<button @click=${increaseBravo}>quartz-b</button>

		<span>${charlie}</span>
		<button @click=${increaseCharlie}>quartz-c</button>
	`
})

