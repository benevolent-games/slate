
![](./assets/s.webp)

<br/>

# 🪨 `@benev/slate`

> 🚧 prerelease wip under constructon subject to change

- frontend ui framework, built on [lit](https://lit.dev/)
- wonderful web components
- versatile views
- hipster hooks syntax
- satisfying state management
- useful utilities
- top-tier typescript typings

<br/>

## 👷 quick start

1. install slate
    ```sh
    npm i @benev/slate
    ```
1. prepare your app's frontend and context
    ```ts
    import {prepare_frontend, Context} from "@benev/slate"

    export const slate = prepare_frontend(
      new class extends Context {
        theme = css`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `
      }
    )
    ```
1. import html and css template functions
    ```ts
    import {html, css} from "@benev/slate"
    ```

<br/>

## ⚙️ components

you can create custom html elements that work in plain html or any web framework.

### carbon — *shadow-dom component*

```ts
const styles = css`span {color: yellow}`

export const MyCarbon = slate.carbon({styles}, use => {
  const count = use.signal(0)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

### oxygen — *light-dom component*

```ts
export const MyOxygen = slate.oxygen(use => {
  const count = use.signal(0)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

### using your components

- register components to the dom
  ```ts
  slate.register_to_dom({
    MyCarbon,
    MyOxygen,
  })
  ```
- now use your components via html
  ```html
  <section>
    <my-carbon></my-carbon>
    <my-oxygen></my-oxygen>
  </section>
  ```

<br/>

## 🖼️ views

views are just like components, but are not registered to the dom as custom html elements.  
instead, they are used via javascript.  
you import them, and inject them into your lit-html templates.  
they accept js parameters called `props`, and are fully typescript-typed.  

### obsidian — *shadow-dom view*

```ts
const styles = css`span {color: yellow}`

export const MyObsidian = slate.obsidian({styles}, use => (start: number) => {
  const count = use.signal(start)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

- **`auto_exportparts` is enabled by default.**
  - auto exportparts is an obsidian feature that makes it bearable to use the shadow dom extensively.
  - if auto_exportparts is enabled, and you provide the view a `part` attribute, then it will automatically re-export all internal parts, using the part as a prefix.
  - thus, parts can bubble up: each auto_exportparts shadow boundary adds a new hyphenated prefix, so you can do css like `::part(search-input-icon)`.

### quartz — *light-dom view*

```ts
export const MyQuartz = slate.quartz(use => (start: number) => {
  const count = use.signal(start)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

### using your views

- **use a quartz view**
  ```ts
  html`<div>${MyQuartz(123)}</div>`
  ```
  - quartz views are beautifully simple
  - without any shadow-dom, they have no stylesheet, and without a wrapping element, they have no attributes
- **use an obsidian view**
  ```ts
  html`<div>${MyObsidian([123])}</div>`
  ```
  - obsidian views need their props wrapped in an array
  - when rendered, obsidian views are wrapped in a `<obsidian-view>` component, which is where the shadow root is attached
  - obsidian views will accept a settings object
    ```ts
    html`
      <div>
        ${MyObsidian([123], {
          content: html`<p>slotted content</p>`,
          auto_exportparts: true,
          attrs: {
            part: "cool",
            "data-whatever": true,
          },
        })}
      </div>
    `
    ```

<br/>

## 🪝 `use` hooks

### universal hooks for all views and components

- **use.state**  
  works like react useState hook
  ```ts
  const [count, setCount] = use.state(0)
  const increment = () => setCount(count + 1)
  ```
- **use.signal**  
  create a reactive container for a value *(inspired by [preact signals](https://preactjs.com/blog/introducing-signals/))*
  ```ts
  const count = use.signal(0)
  const increment = () => count.value++
  ```
  you can directly inject the whole signal into html
  ```ts
  html`<span>${count}</span>`
  ```
- **use.computed**
  create a signal that is derived from other signals
  ```ts
  const count = use.signal(2)
  const tripled = use.computed(() => count.value * 3)
  console.log(tripled.value) //> 6
  ```
- **use.op**  
  create an OpSignal in a loading/error/ready state, and it can hold a result value
  ```ts
  const count = use.op()
  count.run(async() => fetchCount("/count"))
  ```
- **use.flatstate**  
  create a reactive object *(inspired by [mobx](https://mobx.js.org/) and [snapstate](https://github.com/chase-moskal/snapstate))*
  ```ts
  const state = use.flatstate({count: 0})
  const increment = () => state.count++
  ```
- **use.setup**  
  perform setup/cleanup on dom connected/disconnected
  ```ts
  use.setup(() => {
    const interval = setInterval(increment, 1000)
    return () => clearInterval(interval)
  })
  ```
- **use.prepare**  
  initialize a value once
  ```ts
  const random_number = use.prepare(() => Math.random())
  ```
- **use.init**  
  perform a setup/cleanup, but also return a value
  ```ts
  const scene = use.init(() => {

    // called whenever dom is connected
    const scene = setup_3d_scene_for_example()

    return [
      canvas, // value returned
      () => scene.cleanup(), // cleanup called on dom disconnect
    ]
  })
  ```
- **use.context**  
  access to your app's context, for whatever reason
  ```ts
  // wait for all flatstate reactions to complete
  await use.context.flat.wait

  // wait for all signal tower reactons to complete
  await use.context.tower.wait
  ```
  by default, context has `theme`, `tower`, and `flat`, but you specify your own context in `prepare_frontend`, so you can put any app-level state in there that you might want

### special `use` access

- **use.element** ~ *carbon, oxygen, obsidian*  
  access the underlying html element
  ```ts
  use.element.querySelector("p")
  ```
- **use.shadow** ~ *carbon, obsidian*  
  access to the shadow root
  ```ts
  use.shadow.querySelector("slot")
  ```
- **use.attrs** ~ *carbon, oxygen*  
  declare accessors for html attributes
  ```ts
  const attrs = use.attrs({
    start: Number,
    label: String,
    ["data-active"]: Boolean,
  })
  ```
  set them like normal js properties
  ```ts
  attrs.start = 123
  attrs.label = "hello"
  attrs["data-active"] = true
  ```
  get them like normal js properties
  ```ts
  console.log(attrs.start) // 123
  console.log(attrs.label) // "hello"
  console.log(attrs["data-active"]) // true
  ```
  components rerender when any attributes change from outside

<br/>

## 🔮 advanced stuff

### gold and silver elements

```ts
export const MyGold = class extends GoldElement {
  static styles = css`span {color: blue}`

  #state = slate.shell.context.flat.state({
    count: 0,
  })

  render() {
    return html`
      <span>${this.#state.count}</span>
      <button @click=${() => this.#state.count++}>gold</button>
    `
  }
}
```
- non-hooks class-based LitElement-alternative components
- `GoldElement` is a shadow-dom component base class
- `SilverElement` is a light-dom component base class
- these are used as primitives underlying carbon/oxygen components
- they do not have context, theme, or any state management reactivity applied
  - you can apply those with the mixins found by importing `mixins`
  - you can use `Attributes.base(this as BaseElement, {label: String})` to create attribute accessors
  - you can wrap your GoldElement/SilverElement in `component` from `prepare_frontend` to mixin the theme and state management reactivity

### `prepare_frontend` vs `deferred_frontend`

- `prepare_frontend` "bakes" your app context into the component and view functions at import-time, "before" your components and views are defined. this makes your developer experience simple and pleasant for most cases.
- however, if you want to accept the context object *later* for some reason, this can create a bit of an awkward chicken-vs-egg timing situation.
- `deferred_frontend` is an alternative designed to solve this problem by deferring the passing of context to each individual component and view.
- deferred makes your experience more cumbersome, because you have to pass the context into every view before you can use them. deferred_frontend gives you a `provide` function which makes it easy to pass context to a group of views for that purpose.
- you might be better of using `prepare_frontend` and modifying your `context` at runtime, but before you register_to_dom your components
  - eg, you can set `context.theme` at runtime before register_to_dom

<br/>
<br/>

# 🛠️ standalone utilities

if you're using slate's frontend components and views, you'll probably be using these utilities via the `use` hooks, which will provide a better developer experience.

however, the following utilities are little libraries in their own right, and can be used in a standalone capacity.

<br/>

## 🛎️ signals

signals are a simple form of state management.

this implementation is inspired by [preact signals](https://preactjs.com/blog/introducing-signals/).

- **signal tower**
  ```ts
  import {SignalTower} from "@benev/slate"

  const tower = new SignalTower()
  ```
  - signal towers are completely separated from one another
  - you probably only want one in your app, except for special testing situations where isolated signal contexts may be desirable
  - you could export this tower from a module that you import all over your app
- **signals** — they hold values
  ```ts
  const count = tower.signal(0)
  const greeting = tower.signal("hello")

  count.value++
  greeting.value = "bonjour"

  console.log(count.value) //> 1
  console.log(greeting.value) //> "bonjour"
  ```
- **track** — react when signals change
  ```ts
  tower.track(() => console.log("doubled", count.value * 2))
  //> doubled 2

  count.value = 2
  //> doubled 4
  ```
- **html templating** — you can omit .value
  ```ts
  html`<p>count is ${count}</p>`
  ```
- **op signal** — to represent async operations
  ```ts
  const json = tower.op<MyJson>()

  console.log(json.loading) //> true

  await json.run(async() => {
    const data = await fetch_remote_data()
    return JSON.parse(data)
  })

  console.log(json.ready) //> true
  console.log(json.payload) //> {"your": "json data"}
  ```
- **computed** — signal derived from other signals
  ```ts
  count.value = 1

  const tripled = tower.computed(() => count.value * 3)

  console.log(tripled.value) //> 3
  ```
- **wait** — for debounced tracking
  ```ts
  const tripled = tower.computed(() => count.value * 3)
  console.log(tripled.value) //> 3

  count.value = 10
  console.log(tripled.value) //> 3 (too soon!)

  await tower.wait
  console.log(tripled.value) //> 30 (there we go)
  ```

<br/>

## 🥞 flatstate

flatstate help you create state objects and react when properties change.

flatstate is inspired by mobx and snapstate, but designed to be super simple: flatstate only works on *flat* state objects, only the direct properties of state objects are tracked for reactivity.

### flatstate basics

- create a flatstate tracking context
  ```ts
  import {Flat} from "@benev/slate"

  const flat = new Flat()
    // what happens in this flat, stays in this flat.
    // you probably only want one for your whole app.
  ```
- make a flat state object
  ```ts
  const state = flat.state({count: 0})
  ```
- setup a reaction
  ```ts
  flat.reaction(() => console.log(state.count))
    //> 0

  state.count++
    //> 1
  ```
  - flatstate records which state properties your reaction reads
  - flatstate calls your reaction whenever those specific properties change
  - your reaction can listen to more than one state object

### flatstate details

- reactions are debounced -- so you may have to wait to see state changes
  ```ts
  const flat = new Flat()
  const state = flat.state({amount: 100})

  state.amount = 101
  console.log(state.amount) //> 100 (old value)

  await flat.wait
  console.log(state.amount) //> 101 (now it's ready)
  ```
- you can stop a reaction
  ```ts
  const stop = flat.reaction(() => console.log(state.count))

  stop() // end this particular reaction
  ```
- clear all reactions on a flatstate instance
  ```ts
  // clear all reactions on this flat instance
  flat.clear()
  ```

### flatstate reactions

- so first, there's a simple one-function reaction:
  ```ts
  flat.reaction(() => console.log(state.count))
  ```
  - flatstate immediately runs the function, and records which properties it reads
  - then, anytime one of those properties changes, it runs your function again
- you can also do a two-function reaction:
  ```ts
  flat.reaction(
    () => ({count: state.count}),
    ({count}) => console.log(count),
  )
  ```
  - now there's a separation between your "collector" and your "responder"
  - the collector "passes" relevant data to the responder function
  - flatstate calls the responder whenever that data changes
- there's also something called "deepReaction"
  ```ts
  flat.deepReaction(() => console.log(state.count))
  ```
  - it's the same as "reaction", but it has "discovery" enabled
  - discovery means the collector is checked again for every responder call
  - it's less efficient, but allows you to respond to deeply nested recursive structures
- there's also `.auto` and `.manual` reactions
  - these allow you to set options like `discovery` and `debounce` (you can turn off the debouncer)
  - but that's bigbrain stuff that you'll have to read the sourcecode about

### flatstate advanced

- multiple flatstate instances are totally isolated from each other
  ```ts
  const flat1 = new Flat()
  const flat2 = new Flat()
  ```
- create readonly access to a state object
  ```ts
  const state = flat.state({count: 0})
  const rstate = Flat.readonly(state)

  state.count = 1
  await flat.wait
  console.log(rstate.count) //> 1

  rstate.count = 2 // !! ReadonlyError !!
  ```
  - btw, you can use readonly on anything, not just flatstate

### flatstate integration with frontend elements

- let your components rerender on flat state changes
  ```ts
  import {apply} from "@benev/slate"

  const MyElement2 = mixin.flat(flat)(MyElement)
    // can also be a class decorator

  const elements2 = apply.flat(flat)(elements)
  ```
  - this works on any BaseElement, which includes LitElement, GoldElement, SilverElement, carbon, and oxygen

<br/>

## 💫 op

utility for ui loading/error/ready states.

useful for implementing async operations that involve loading indicators.

you get a better dev-experience if you use ops via signals, but here is the documentation for plain ops on their own, without signals.

- create some ops
  ```ts
  import {Op} from "@benev/slate"

  Op.loading()
    //= {mode: "loading"}

  Op.error("a fail occurred")
    //= {mode: "error", reason: "a fail occurred"}

  Op.ready(123)
    //= {mode: "ready", payload: 123}
  ```
- you can run an async operation and keep things synchronized
  ```ts
  let my_op = Op.loading()

  await Op.run(op => my_op = op, async() => {
    await nap(1000)
    return 123
  })
  ```
- you can create op signals that have op functionality built in
  ```ts
  const count = use.op()

  count.run(async() => {
    await sleep(1000)
    return 123
  })
  ```
- functions to interrogate an op
  ```ts
    //        type for op in any mode
    //                 v
  function example(op: Op.Any<number>) {

    // branching based on the op's mode
    Op.select(op, {
      loading: () => console.log("op is loading"),
      error: reason => console.log("op is error", reason),
      ready: payload => console.log("op is ready", payload)
    })

    const payload = Op.payload(op)
      // if the mode=ready, return the payload
      // otherwise, return undefined
  }
  ```

<br/>

## 🪈 pipe

- pipe data through a series of functions
- maybe you've done silly nesting like this:
  ```ts
  // bad
  register_to_dom(
    apply.signals(signals)(
      apply.flat(flat)(
        apply.css(theme)(
          requirement.provide(context)(elements)
        )
      )
    )
  )
  ```
- now you can do this instead:
  ```ts
  import {Pipe} from "@benev/slate"

  // good
  Pipe.with(elements)
    .to(requirement.provide(context))
    .to(apply.css(theme))
    .to(apply.flat(flat))
    .to(apply.signals(signals))
    .to(register_to_dom)
  ```

