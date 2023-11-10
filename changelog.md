
### v0.0.0-dev.25

- !! `flat`, `signals`, and `watch` removed from `Context`
  ```ts
  // now we do this
  import {flat, signals, watch} from "@benev/slate"
  ```
- !! `setup` replaced with `Slate` class
  ```ts
  // old
  const slate = setup(context)

  // new
  const slate = new Slate(context)
  ```
  - slate.shell has been `deleted` -- now Slate extends Shell (slate is a shell now)

### v0.0.0-dev.21

- !! renamed `prepare_frontend` to `setup`
- added synonyms
  - `carbon` => `shadow_component`
  - `oxygen` => `light_component`
  - `obsidian` => `shadow_view`
  - `quartz` => `light_view`

### v0.0.0-dev.16

- !! significant rework
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

- !! massive rework
  - deleted shale and clay views
  - added obsidian/quartz views
  - added carbon/oxygen elements
  - rework prepare_frontend system entirely
  - rework context
  - add signals

### v0.0.0-dev.5

