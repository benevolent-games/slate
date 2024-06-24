
import {css, html} from "../nexus/html.js"
import {interval} from "../tools/interval.js"
import {defaultNexus} from "../nexus/nexus.js"
import {RenderResult} from "../nexus/parts/types.js"
import {makeLoadingEffect} from "./make-loading-effect.js"

//
// error indicator
//

const errorStyle = css`
	:host {
		color: red;
		font-family: monospace;
	}
`

const AsciiErrorIndicator = defaultNexus.shadowView(use => (reason: string) => {
	use.name("error-indicator")
	use.styles(errorStyle)

	return html`${reason || "unknown error"}`
})

//
// loading indicator
//

const loadingStyle = css`
	:host {
		font-family: monospace;
	}
`

const AsciiLoadingIndicator = defaultNexus.shadowView(use => (hz: number, animation: RenderResult[]) => {
	use.name("loading-indicator")
	use.styles(loadingStyle)

	const frame = use.signal(0)

	use.mount(() => interval(hz, () => {
		const next = frame.value + 1
		frame.value = (next < animation.length)
			? next
			: 0
	}))

	return html`${animation[frame.value]}`
})

//
// function to setup animated effects
//

export const makeAnimatedLoadingEffect = (hz: number, animation: RenderResult[]) => makeLoadingEffect({
	error: reason => AsciiErrorIndicator([reason]),
	loading: () => AsciiLoadingIndicator([hz, animation]),
})

//
// ready-made effects
//

/** animated loading indicators */
export const loading = {

	/** animated pattern that looks like "01101" */
	binary: makeAnimatedLoadingEffect(20, [
		"00000",
		"00001",
		"00010",
		"00101",
		"01011",
		"10110",
		"01100",
		"11001",
		"10011",
		"00111",
		"01110",
		"11101",
		"11011",
		"10110",
		"01101",
		"11010",
		"10100",
		"01000",
		"10000",
	]),

	/** animated braille-style spinner that looks like "⣾" */
	braille: makeAnimatedLoadingEffect(20, [
		"⣾",
		"⣷",
		"⣯",
		"⣟",
		"⡿",
		"⢿",
		"⣻",
		"⣽",
	]),
}

