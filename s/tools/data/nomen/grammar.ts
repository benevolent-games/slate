
import {ob} from "../../ob.js"
import {Bytes} from "../bytes.js"
import {GrammarTemplate, PhraseFns} from "./types.js"

export class Grammar<P extends PhraseFns> {
	constructor(public phraseFns: P, public templates: GrammarTemplate<P>[]) {}

	static phrases = <P extends PhraseFns>(phrases: P) => ({
		templates: (templates: GrammarTemplate<P>[]) => (
			new this<P>(phrases, templates)
		),
	})

	generate([firstByte, ...bytes]: Uint8Array) {
		const template = this.templates[firstByte % this.templates.length]
		const phraseCount = Object.keys(this.phraseFns).length
		const bytesPerPhrase = Math.floor(bytes.length / phraseCount)

		let indexCounter = 0

		const phrases = ob(this.phraseFns).map(fn => {
			const index = indexCounter++
			const start = index * bytesPerPhrase
			const end = Math.min(start + bytesPerPhrase, bytes.length - 1)
			const buffer = new Uint8Array(bytes.slice(start, end))
			return fn(buffer)
		})

		return template(phrases)
	}

	random() {
		const buffer = Bytes.random(32)
		return this.generate(buffer)
	}
}

