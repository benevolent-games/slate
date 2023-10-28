
### v0.0.0-dev.16

-  significant rework
  - introduce experimental new `context.watch` WatchTower and StateTree systems
  - rename `context.tower` to `context.signals`
  - implement new context shell system
    - setting context can now be deferred to runtime
    - prepare_frontend returns a context shell
    - prepare_frontend returns a set_context function
    - we can now import the shell, so components/views can use context
    - and then we can set the context on the shell later at runtime
    - this made `deferred_frontend` obsolete, so we deleted it
  - prepare_frontend no longer returns `component` helper
    - prepare_frontend is no longer involved in baking "naked" gold/silver/lit components, due to timing issues
    - if you want to roll your own components, you can use `apply.context(context)({MyComponent})` to wire them up to a context on your own time

### v0.0.0-dev.6

-  massive rework
  - deleted shale and clay views
  - added obsidian/quartz views
  - added carbon/oxygen elements
  - rework prepare_frontend system entirely
  - rework context
  - add signals

### v0.0.0-dev.5

