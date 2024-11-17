
import {css, CSSResultGroup} from "lit"

export const cssReset: CSSResultGroup = css`
	@layer reset {
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;

			scrollbar-width: thin;
			scrollbar-color: #888 transparent;
		}

		::-webkit-scrollbar { width: 8px; }
		::-webkit-scrollbar-track { background: transparent; }
		::-webkit-scrollbar-thumb { background: #333; border-radius: 1em; }
		::-webkit-scrollbar-thumb:hover { background: #444; }
	}
`

export class Context {
	theme: CSSResultGroup = []
}

