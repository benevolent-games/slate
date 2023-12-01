
import {Flat} from "../flatstate/flat.js"
import {WatchTower} from "../watch/tower.js"
import {Reactor} from "../reactor/reactor.js"
import {SignalTower} from "../signals/tower.js"

export const flat = new Flat()
export const signals = new SignalTower()
export const watch = new WatchTower(signals)

export const flatstate = flat.state.bind(flat)
export const signal = signals.signal.bind(signals)
export const reactor = new Reactor(flat, signals)

