
### v0.0.0

in this recent work, the `flat` and `signals` state management apis are converging.

- ❗ removed synonyms `slate.carbon`, `slate.oxygen`, `slate.obsidian`, `slate.quartz`
  - now you should use `slate.shadow_component`, `slate.light_component`, `slate.shadow_view`, `slate.shadow_component` respectively
- ❗ `flat` breaking changes
  - removed `.manual`, `.auto`, `.deepReaction`
  - flat now implements `ReactorCore`
    - `.reaction` always has debouncing and discovery enabled
    - `.wait` to wait for the debouncer to fire responders
    - `.lean` for advanced integrations
- ❗ `signals` breaking changes
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

### v0.0.0-dev.28

- ❗ change Initiator signature, added `.cleanup` helpers

### v0.0.0-dev.27

- ❗ replace WatchBox with Signal
- ❗ WatchTower now requires SignalTower as a param
- 🍏 add exports 'flatstate' and 'signal'
- 🍏 add ZipAction.prep, ZipAction.prepAction, ZipAction.prepBlueprint

### v0.0.0-dev.25

- ❗ `flat`, `signals`, and `watch` removed from `Context`
  ```ts
  // now we do this
  import {flat, signals, watch} from "@benev/slate"
  ```
- ❗ `setup` replaced with `Slate` class
  ```ts
  // old
  const slate = setup(context)

  // new
  const slate = new Slate(context)
  ```
  - slate.shell has been `deleted` -- now Slate extends Shell (slate is a shell now)

### v0.0.0-dev.21

- ❗ renamed `prepare_frontend` to `setup`
- 🍏 added synonyms
  - `carbon` => `shadow_component`
  - `oxygen` => `light_component`
  - `obsidian` => `shadow_view`
  - `quartz` => `light_view`

### v0.0.0-dev.16

- ❗ significant rework
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

- ❗ massive rework
  - deleted shale and clay views
  - added obsidian/quartz views
  - added carbon/oxygen elements
  - rework prepare_frontend system entirely
  - rework context
  - add signals

### v0.0.0-dev.5

