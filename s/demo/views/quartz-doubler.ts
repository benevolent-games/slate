
import {html} from "lit"
import {quartzview} from "../frontend.js"

export const QuartzDoubler = quartzview(context => use => (start: number) => {
	const [count, setCount] = use.state(start)
	const increment = () => setCount(count + 1)

	return html`
		<span>${count}</span>
		<button @click=${increment}>quartz+</button>
	`
})

