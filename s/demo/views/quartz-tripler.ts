
import {quartz} from "../frontend.js"
import {html} from "../../shiny/quartz.js"

export const QuartzTripler = quartz(use => (start: number) => {

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
		<button @click=${increaseAlpha}>alpha</button>

		<span>${bravo.count}</span>
		<button @click=${increaseBravo}>bravo</button>

		<span>${charlie}</span>
		<button @click=${increaseCharlie}>charlie</button>
	`
})

