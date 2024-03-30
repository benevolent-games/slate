
# @benev/slate changelog

### legend

- 🟥 *breaking change*
- 🔶 *maybe breaking change*
- 🍏 *non-breaking addition, fix, or enhancement*

<br/>

## v0.1.0

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

## v0.0.0

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

## v0.0.0-dev.28

- 🟥 change Initiator signature, added `.cleanup` helpers

## v0.0.0-dev.27

- 🟥 replace WatchBox with Signal
- 🟥 WatchTower now requires SignalTower as a param
- 🍏 add exports 'flatstate' and 'signal'
- 🍏 add ZipAction.prep, ZipAction.prepAction, ZipAction.prepBlueprint

## v0.0.0-dev.25

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

## v0.0.0-dev.21

- 🟥 renamed `prepare_frontend` to `setup`
- 🍏 added synonyms
  - `carbon` => `shadow_component`
  - `oxygen` => `light_component`
  - `obsidian` => `shadow_view`
  - `quartz` => `light_view`

## v0.0.0-dev.16

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

## v0.0.0-dev.6

- 🟥 massive rework
  - deleted shale and clay views
  - added obsidian/quartz views
  - added carbon/oxygen elements
  - rework prepare_frontend system entirely
  - rework context
  - add signals

## v0.0.0-dev.5

