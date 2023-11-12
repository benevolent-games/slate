
import {Flat} from "../flatstate/flat.js"
import {SignalTower} from "../signals/tower.js"
import {WatchTower} from "../watch/tower.js"

export const flat = new Flat()
export const signals = new SignalTower()
export const watch = new WatchTower()

export const flatstate = flat.state.bind(flat)
export const signal = signals.signal.bind(signals)

