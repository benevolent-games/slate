
import {html} from "lit"

export function quartz() {}
export function obsidian() {}

/////

const MyView = quartz(context => use => (props: any) => {

	// you can use preact signals
	const alpha = use.signal(0)

	// or flatstate
	const bravo = use.flat({count: 0})

	// or traditional react hooks
	const [charlie, setCharlie] = use.state(0)

	const incrementAlpha = () => alpha.value++
	const incrementBravo = () => bravo.count++
	const incrementCharlie = () => setCharlie(charlie + 1)

	use.setup(() => {
		const interval = setInterval(incrementAlpha, 1000)
		return () => clearInterval(interval)
	})

	return html`
		${count.value}
	`
})

////

const example = html`
	${MyView(props, options)}
`

