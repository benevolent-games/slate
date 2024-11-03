
import {MemeNames} from "./meme-names.js"
import {randomFullName} from "./random-names.js"

console.log("====== syllabic names ======")

for (let i = 0; i < 20; i++)
	console.log(" - ", randomFullName())

const memes = new MemeNames()

console.log("====== meme names ======")

for (let i = 0; i < 20; i++)
	console.log(" - ", memes.generate())

