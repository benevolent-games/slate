
# @benev/slate changelog
- 🟥 breaking change
- 🔶 deprecation or possible breaking change
- 🍏 harmless addition, fix, or enhancement

<br/>

## v0.3

### v0.3.7
- 🔶 replace temporary `stz` tracker with the new `strata` tracker

### v0.3.6
- 🍏 integrate [stz](https://github.com/e280/stz) tracker into reactor for automatic [strata](https://github.com/e280/strata) reactivity

### v0.3.5
- 🍏 export lit's `unsafeHTML`

### v0.3.4
- 🍏 export lit's `unsafeCSS` and `nothing`

### v0.3.3
- 🔶 rename `register_to_dom` to merely `register`

### v0.3.1
- 🍏 `register_to_dom` now auto-upgrades elements by default

### v0.3.0
- 🟥 eliminated the default css theme (which was a css reset)
  - now, by default, slate shadow doms have no default styling at all, it's up to you
  - renamed slate export `defaultTheme` to `cssReset`
  - to restore the original behavior, do this:
    ```js
    import {nexus, cssReset} from "@benev/slate"
    nexus.context.theme = cssReset
    ```
- 🟥 replace `OpSignal.load(~)` helper with `signals.load(~)`
- 🟥 signals now only publish when their values actually change
  - there's this common pattern where to trigger a signal publish, we simply set it's value again -- but this will now fail if the value is the same as it was previously
  - in other words, signals now only react to genuine changes
  - the comparison is shallow, so setting the same object over and over will not publish any changes
  - the new preferred pattern is to call `mySignal.publish()` manually
- 🟥 rename `repeat` to `repeating`, to make room to export lit's `repeat` directive
- 🔶 deprecate `Map2`, renamed to `MapG` (to avoid confusion with vectors like Vec2)
- 🔶 deprecate `Text`, renamed to `Txt` (avoiding name collision with builtin)
- 🔶 deprecate `wherefor`, renamed to `whereby`
- 🔶 deprecate `Bytename`, recommend new `Barname` and `Badge` systems instead
- 🔶 rename `mySignal.setValueNoPublish(v)` to `mySignal.setWithoutPublish(v)` (deprecated old name)
- 🍏 Barname upgraded to support word-groups, and more resilient parsing
- 🍏 add `dedupe` tool, helper to deduplicate arrays using a set
- 🍏 add new signal methods
  - `mySignal.setDeep(v)`
  - `mySignal.setAndPublish(v)`
  - `mySignal.setWithoutPublish(v)`

## v0.2

### v0.2.17
- 🍏 add `Content` type, which may be preferable to `RenderResult`
- 🍏 improve `opSignal.load` with deconfliction: now only the latest run will update the signal
- 🍏 add `OpSignal.load` static helper, to create and start an operation

### v0.2.16
- 🔶 `repeat` function no longer immediately invokes your fn (works more like setTimeout now)
- 🍏 add export `computed`, alias for `signals.computed`

### v0.2.15
- 🔶 fix: `repeat` wasn't supposed to be async

### v0.2.14
- 🔶 deprecated `repeater` in favor of leaner `repeat` implementation
  - deprecated `Repeater` class is now obsolete
  - deprecated `repeater.hz` in favor of `repeat.hz`

### v0.2.13
- 🍏 isColorSupported accepts env var `FORCE_COLOR`

### v0.2.12
- 🔶 change `Bytename` syllable dictionaries (names will change)

### v0.2.11
- 🔶 change `Bytename` syllable dictionaries (names will change)
- 🍏 add tools
  - `isNode`
  - `isDeno`
  - `isColorSupported`

### v0.2.10
- 🍏 add tools
  - `templateString` -- template no-op, it's just a string
  - `templateParts` -- return the strings and injected values
  - `svgSlate` -- for ingesting icons in turtle
  - `svgTurtle` -- for ingesting icons in slate, requires manual import
    - `import {svgTurtle} from "@benev/slate/x/tools/svgs/svg-turtle.js"`
- 🍏 add data tools:
  - `Anka` -- display binary data with random indian characters
  - `Base58` -- standard data encoding
  - `Base64` -- standard data encoding
  - `Base64url` -- standard data encoding
  - `Bytename` -- encode arbitrary bytes as human-readable names
  - `Bytes` -- helper fns like `random` to generate random binary
  - `Hex` -- encode arbitrary data in hexadecimal
  - `Text` -- convert between text and bytes

### v0.2.9
- 🔶 rename `generate_id` to `hexId` (old name deprecated)
- 🍏 add tools:
  - `escapeRegex`
  - `hash`
  - `hat`
  - `randomFullName`
  - `MemeNames`
  - `repeater`

### v0.2.8
- 🔶 rename `GoldElement` to `ShadowElement`
- 🔶 rename `SilverElement` to `LightElement`
- 🔶 rename `mixin.reactor` to `mixin.reactive`
- 🔶 rename `apply.reactor` to `apply.reactive`

### v0.2.7
- 🔶 rename `defaultNexus` to `nexus`
- 🔶 rename `apply.context` to `apply.setup`
- 🍏 enhance `use.styles` now accepts any number of stylesheet args
  ```ts
  // you can now pass multiple stylesheets this way
  use.styles(cssA, cssB, cssC)
  ```
- 🍏 enhance `use.css` alias for `use.styles`
- 🍏 add `mixin.setup` (to match `apply.setup`)
- 🍏 add new package exports:
  - `lightView` (alias for `nexus.lightView`)
  - `lightComponent` (alias for `nexus.lightComponent`)
  - `shadowView` (alias for `nexus.shadowView`)
  - `shadowComponent` (alias for `nexus.shadowComponent`)
  - `shadowComponentify` (alias for `nexus.shadowComponentify`)
  - `component` (alias for `nexus.component`)
  - `components` (alias for `nexus.components`)

### v0.2.6

- 🔶 tweak generic type signature on `Pool`
- 🔶 deprecated `explode_promise` (prefer `deferPromise`)
- 🍏 add: tool `concurrent`
- 🍏 add: tool `deferPromise`
- 🍏 add: tool `deadline`
- 🍏 enhance: `pubsub`
  - added new `once` method
  - now you can subscribe async functions
  - publish now returns a promise, to wait for all subscribers to finish working

### v0.2.5

- 🔶 ts target `es2023`, seems all evergreen browsers support it
- 🔶 deprecated `maptool` in favor of `Map2`
- 🍏 add: tool `requestAnimationFrameLoop`
- 🍏 add: tool `Map2` facility will replace maptool

### v0.2.2

- 🍏 add `use.deferOnce`
- 🔶 deprecated `is.void(x)`, renamed to `is.unavailable(x)`
- 🔶 deprecated `is.defined(x)`, renamed to `is.available(x)`

### v0.2.0

- 🟥 ***camel case!***
  - `light_view` is now `lightView`
  - `light_component` is now `lightComponent`
  - `shadow_view` is now `shadowView`
  - `shadow_component` is now `shadowComponent`
- 🟥 `use.defer`
  - now returns a `Signal`
  - it used to directly return a value
  - the reason for this change, was that the old way created a footgun where it's very easy to accidentally hold an old reference to the deferred value that you wanted. so, now using a signal, your access to the signal's value is more likely to be an up-to-date reference
- op loading effects
  - 🟥 `prep_op_effect` replaced by `makeLoadingEffect` or `makeAnimatedLoadingEffect`
  - 🍏 added `loading` effects like `loading.binary(op, onReady)` and `loading.braille(op, onReady)`
- 🟥 eliminated `@benev/slate/x/pure.js`
  - beware if you are using slate in a node.js environment
  - `pure.js` was an alternative entrypoint for node to import the parts of slate that didn't touch any DOM apis
  - instead, now, if you are importing slate into node, you should do this first:
      ```ts
      import "@benev/slate/x/node.js"
      ```
  - all this does is assign `global.HTMLElement = class {}` because extending HTMLElement is the only contact that slate has with the dom at import time
  - thus, the new `node.js` is a little shim that lets you import all of slate in node (maybe for unit testing or to use some tools)
- 🟥 `interval` tool: changed arguments
  - now it accepts plain milliseconds
  - whereas the new `interval.hz` accepts hertz, replacing what used to be called `interval`
  - thus, to upgrade, replace `interval(1, fn)` with `interval.hz(1, fn)`
- 🔶 deprecate `signal.subscribe` in favor of `signal.on`
- 🔶 deprecate tools:
  - `Trashcan` (in favor of `Trashbin`)
  - `pub` (in favor of `pubsub`)
- 🍏 added `use.load` helper for creating an op and immediately initiating a load operation
- 🍏 added tools:
  - `wherefor`
  - `ref` and `Ref`

<br/>

## v0.1

### v0.1.2

- 🔶 added `watch.wait` promise, because watch tower dispatches are now debounced

### v0.1.1

- 🔶 rename `FancyEventListener` to `LitListener`
- 🍏 add: tools `ev`, `Trashcan`, `litListener`, and `pubsub`
- 🍏 views now expect a relaxed template type, `RenderResult`, which means views can return other views and strings etc

### v0.1.0

nexus rewrite
- 🟥 `Slate` renamed to `Nexus`
- 🟥 silly names have been purged
  - renamed `ObsidianRenderer` to `ShadowViewRenderer`
  - renamed `CarbonRenderer` to `ShadowComponentRenderer`
  - renamed `QuartzRenderer` to `LightViewRenderer`
  - renamed `OxygenRenderer` to `LightComponentRenderer`
  - tons of renames following the same pattern have occurred

shadow views and components
- 🟥 simpler syntax: remove settings array, in favor of new hooks
  - old way
    ```ts
    slate.shadow_view({name: "coolview", styles}, use => () => {
      return html`hi`
    })
    ```
  - new way
    ```ts
    slate.shadow_view(use => () => {
      use.name("coolview")
      use.styles(styles)

      return html`hi`
    })
    ```

use
- 🟥 `use.setup` renamed to `use.mount`
- 🟥 `use.prepare` renamed to `use.once`
- 🟥 renamed various types and helpers
  - types
    - `SetupFn` to `Mount`
    - `Setdown` to `Unmount`
    - `InitFn` to `Init`
  - helpers
    - `setupFn` to `mountFn`
- 🍏 add hook `use.effect(fn, dependencies)` (all views and components)
- 🍏 add hook `use.defer(fn)` (all views and components)
- 🍏 add hook `use.name(name)` (all views)
- 🍏 add hook `use.styles(styles)` (shadow_view and shadow_component)

views
- 🟥 `<obsidian-view>` renamed to `<slate-view>`
- 🟥 light_view (quartz) contents are now wrapped in `<slate-view>`
  - this is to provide an anchor point from which the view can query its own contents
  - this also helps light_view behavior match shadow_view

ops (and OpSignal)
- 🟥 rename `Op.run` to `Op.load`
  - also rename `OpSignal->run` to `OpSignal->load`
- 🟥 `Op.load` and `OpSignal->load` now throws errors
  - it still sets the op to an error state
  - but now it also throws an error, so you can catch it directly
- 🟥 rename op 'mode' to 'status'
  - change `Op.Mode` to `Op.Status`
  - change `op.mode` to `op.status` on your op objects
- 🟥 rework OpSignal checkers, from getters to functions
  - change `op.loading` to `op.isLoading()`
  - change `op.error` to `op.isError()`
  - change `op.ready` to `op.isReady()`
  - this was necessary for the new form to be proper ts type guards
- 🍏 fix checkers like `Op.is.loading` to have proper ts type guards
- 🍏 fix signals.op return type to be OpSignal

tools
- 🟥 rename `MapSubset` type to `MapBase`
- 🟥 rename `maptool(map).grab(..)` to `maptool(map).guarantee(..)`
- 🍏 export `mapGuarantee(map, k, v)` function, technically more efficient than `maptool(map).guarantee(k, v)`
- 🟥 rework `ob` tool syntax
  - `ob.map(object, transform)` becomes `ob(object).map(transform)`
  - `ob.filter(object, predicate)` becomes `ob(object).filter(predicate)`
- 🟥 recapitulated `deepEqual` and `deepFreeze` into new `deep` tool
  - `deepEqual` becomes `deep.equal`
  - `deepFreeze` becomes `deep.freeze`
  - both functions have been reworked to handle maps and sets
- 🍏 add `is` tool
  - proper typescript type guard support
  - `is.object(x)`
  - `is.array(x)`
  - `is.defined(x)`

watch
- 🟥 `watch.track` now returns an unsubscribe function, instead of the collector's data
  - if you need the data from your collector, just run the collector yourself
- 🍏 add `Historian` and `AppCore` for creating apps with undo/redo capabilities

<br/>

## v0.0

### v0.0.0

in this recent work, the `flat` and `signals` state management apis are converging.

- 🟥 removed synonyms `slate.carbon`, `slate.oxygen`, `slate.obsidian`, `slate.quartz`
  - now you should use `slate.shadow_component`, `slate.light_component`, `slate.shadow_view`, `slate.shadow_component` respectively
- 🟥 `flat` breaking changes
  - removed `.manual`, `.auto`, `.deepReaction`
  - flat now implements `ReactorCore`
    - `.reaction` always has debouncing and discovery enabled
    - `.wait` to wait for the debouncer to fire responders
    - `.lean` for advanced integrations
- 🟥 `signals` breaking changes
  - removed `.track` (now you should use `.reaction` instead)
  - signals now implements `ReactorCore`
    - `.reaction` always has debouncing and discovery enabled
    - `.wait` to wait for the debouncer to fire responders
    - `.lean` for advanced integrations
- 🔶 the way reactivity works has been rewritten, so be wary of new bugs
  - the flatstate and signals mixins have been rewritten using the new `.lean` methods
  - the internal `setup_reactivity` for slate components and views has been rewritten using the reactor's `.lean`
- 🍏 added new state management system called `reactor`
  - implements `ReactorCore` (has `.reaction`, `.wait`, and `.lean`)
  - reactor *combines* both flatstate and signals reactivity
  - so you can make reactions that listen to both flatstates and signals
  - see usage examples in the readme
- 🍏 added new `mixin.reactor` and `apply.reactor`
  - this is how you can mixin `reactor` support for your own elements, thus adding reactivity for both flatstate and signals at once
- note, there are no changes to `watch`
  - `watch` is fundamentally different than flatstate and signals, and is not suitable to become a ReactorCore
  - watch does not have any "automated" reactivity, it's always explicit, so it has `.track` instead of `.reaction`

<br/>

## v0.0-dev

### v0.0.0-dev.28

- 🟥 change Initiator signature, added `.cleanup` helpers

### v0.0.0-dev.27

- 🟥 replace WatchBox with Signal
- 🟥 WatchTower now requires SignalTower as a param
- 🍏 add exports 'flatstate' and 'signal'
- 🍏 add ZipAction.prep, ZipAction.prepAction, ZipAction.prepBlueprint

### v0.0.0-dev.25

- 🟥 `flat`, `signals`, and `watch` removed from `Context`
  ```ts
  // now we do this
  import {flat, signals, watch} from "@benev/slate"
  ```
- 🟥 `setup` replaced with `Slate` class
  ```ts
  // old
  const slate = setup(context)

  // new
  const slate = new Slate(context)
  ```
  - slate.shell has been `deleted` -- now Slate extends Shell (slate is a shell now)

### v0.0.0-dev.21

- 🟥 renamed `prepare_frontend` to `setup`
- 🍏 added synonyms
  - `carbon` => `shadow_component`
  - `oxygen` => `light_component`
  - `obsidian` => `shadow_view`
  - `quartz` => `light_view`

### v0.0.0-dev.16

- 🟥 significant rework
  - introduce experimental new `context.watch` WatchTower and StateTree systems
  - rename `context.tower` to `context.signals`
  - `prepare_frontend` usage changes
    - new pattern returns the "slate" object
    - "slate.carbon", "slate.obsidian", etc
    - now setting of context can be deferred to runtime
    - `slate.context = new Context()`
    - this made `deferred_frontend` obsolete, so we deleted it
  - prepare_frontend's component helper has changed
    - plain components, like gold and silver, no longer need any helper
    - now you must use the new `slate.components` helper to apply the current context to a group of plain components, at runtime, prior to registration (if you want the components to be reactive and use the css theme)
  - change `Attributes.base` to `attributes`

### v0.0.0-dev.6

- 🟥 massive rework
  - deleted shale and clay views
  - added obsidian/quartz views
  - added carbon/oxygen elements
  - rework prepare_frontend system entirely
  - rework context
  - add signals

### v0.0.0-dev.5

