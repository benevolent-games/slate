
import {falryskNameGrammar} from "./presets/falrysk.js"

const grammar = falryskNameGrammar()

for (const _ of Array(20))
	console.log(grammar.random())

