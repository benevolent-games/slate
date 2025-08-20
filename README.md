
> [!IMPORTANT]
> # ⚠️ *SLATE IS DEPRECATED.*
> slate has been succeeded by [**@e280/sly**](https://github.com/e280/sly).  
> please use sly instead.  

<br/>

---
---

![](./assets/s.webp)

<br/>

# 🪨 `@benev/slate` by chase moskal

- frontend ui library, built on [lit](https://lit.dev/)
- wonderful web components
- versatile views
- hipster hooks syntax
- satisfying state management
- useful utilities
- top-tier typescript typings

<br/>

### slate is my life journey to "solve frontend".
i've iterated on this for many years, and it's always shifting and changing as i build real apps with it.  
features, handy tools, and state management patterns, are accumulating and being refined.  

### you see, most devs misunderstand how to leverage web components..

please don't make your whole app out of web components.. they're too cumbersome for that — *you need views!*

- think of **web components** as an interface for *html authors*
  - components allow novices to easily paste complex features onto html pages
  - but these components are html-native — not typescript-native — so they don't take typesafe props, and they're referred to by tag names with bad editor support
- **views** are the right building blocks for typescript developers to structure their app ui
  - "slate views" are typescript-native — you import 'em, and they take typesafe props
  - slate views are built on `lit`
  - slate views have a hooks-based usage pattern inspired by react
  - slate helps you fully leverage the power of the `shadow dom`
  - slate offers signals and any other hip newfangled patterns that i fancy
  - slate also lets you build html web components with the *same* syntax and hooks as the views

so, you want to think of web components as the tip of your iceberg — they are the entrypoints to your ui — they are the universal control surfaces to help html authors interact with your systems — but below the surface, most of your internals can be made of nicely composable views.

<br/>

## 👷 quick start

1. **install slate**
    ```sh
    npm i @benev/slate
    ```
1. **import templating functions**  
    these are augmented versions of `lit`'s templating functions, which directly implement `signals`.  
    they are fully compatible with lit.  
    ```ts
    import {html, css, svg} from "@benev/slate"
    ```

<br/>

## ⚙️ slate components

you can create custom html elements that work in plain html or any web framework.

### shadowComponent

```ts
import {shadowComponent, html, css} from "@benev/slate"

export const MyShadowComponent = shadowComponent(use => {
  use.styles(css`span {color: yellow}`)

  const count = use.signal(0)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

### lightComponent

```ts
import {lightComponent, html, css} from "@benev/slate"

export const MyLightComponent = lightComponent(use => {
  const count = use.signal(0)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

### deploying your components

- register components to the dom
  ```ts
  import {register_to_dom} from "@benev/slate"

  register_to_dom({MyShadowComponent, MyLightComponent})
  ```
- now use your components via html
  ```html
  <section>
    <my-shadow-component></my-shadow-component>
    <my-light-component></my-light-component>
  </section>
  ```
  - the camel case names like `MyComponentName` are automatically `dashify`'d into `my-component-name`
- if you're making a library of components, please export the components so that the downstream app can register them
  ```ts
  export {register_to_dom, apply, css} from "@benev/slate"
  export const myComponents = {MyShadowComponent, MyLightComponent}
  ```
  that helps downstream developers to cool stuff like apply their own css theme, or rename components
  ```ts
  import {myComponents, register_to_dom, apply, css} from "@benev/slate"

  const myCustomTheme = css`button { color: red; }`

  register_to_dom(
    apply.css(myCustomTheme)(
      myComponents,
    )
  )
  ```

<br/>

## 🖼️ slate views

views are just like components, but are not registered to the dom as custom html elements.  
instead, they are used via javascript.  
you import them, and inject them into your lit-html templates.  
they accept js parameters called `props`, and are fully typescript-typed.  

### shadowView

```ts
import {shadowView, html, css} from "@benev/slate"

export const MyShadowView = shadowView(use => (start: number) => {
  use.name("my-shadow-view")
  use.styles(css`span {color: yellow}`)

  const count = use.signal(start)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

- **`auto_exportparts` is enabled by default.**
  - auto exportparts is an experimental shadowView feature that makes it bearable to use the shadow dom extensively.
  - if auto_exportparts is enabled, and you provide the view a `part` attribute, then it will automatically re-export all internal parts, using the part as a prefix.
  - thus, parts can bubble up: each auto_exportparts shadow boundary adds a new hyphenated prefix, so you can do css like `::part(search-input-icon)`.

### lightView

```ts
export const MyLightView = lightView(use => (start: number) => {
  use.name("my-light-view")

  const count = use.signal(start)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

### deploying your views

- **using a shadow view**
  ```ts
  html`<div>${MyShadowView([123])}</div>`
  ```
  - shadow views need their props wrapped in an array, to separate them from the optional options object:
    ```ts
    html`
      <div>
        ${MyShadowView([123], {
          content: html`<p>slotted content</p>`,
          auto_exportparts: true,
          attrs: {part: "cool", "data-whatever": true},
        })}
      </div>
    `
    ```
- **using a light view**
  ```ts
  html`<div>${MyLightView(123)}</div>`
  ```
  - light views are beautifully simple
  - they just take props as arguments, no array-wrapping
  - without any shadow-dom, they have no stylesheet and no attributes
- note
  - all views are rendered into a `<slate-view view="my-view-name">` component

<br/>

## 🪝 `use` hooks — for views and components

slate's hooks have the same rules as any other framework's hooks: the order that hooks are executed in matters, so you must not call hooks under an `if` statement or in any kind of `for` loop or anything like that.

### core hooks
- **use.name** ~ *shadowView, lightView*  
  assign a stylesheet to the shadow root.  
  only works on views, because having a name to differentiate views is handy (components have the names they were registered to the dom with).  
  ```ts
  use.name("my-cool-view")
  ```
- **use.styles** ~ *shadowView, shadowComponent*  
  assign a stylesheet to the shadow root.  
  only works on shadow views or components (light views/components are styled from above).  
  ```ts
  use.styles(css`span { color: yellow }`)
  ```
- **use.state**  
  works like react useState hook.  
  i actually recommend using signals instead (more on those later).
  ```ts
  const [count, setCount] = use.state(0)
  const increment = () => setCount(count + 1)
  ```
- **use.once**  
  initialize a value once
  ```ts
  const random_number = use.once(() => Math.random())
  ```
- **use.mount**  
  perform setup/cleanup on dom connected/disconnected
  ```ts
  use.mount(() => {
    const interval = setInterval(increment, 1000)
    return () => clearInterval(interval)
  })
  ```
- **use.init**  
  perform a setup/cleanup, but also return a value
  ```ts
  const scene = use.init(() => {

    // called whenever dom is connected
    const scene = setup_3d_scene_for_example()

    return [
      scene, // value returned
      () => scene.cleanup(), // cleanup called on dom disconnect
    ]
  })
  ```
- **use.defer**  
  execute a function everytime a render finishes.  
  you might want to do this if you need to query for elements you just rendered.  
  ```ts
  use.defer(() => {
    const div = document.querySelector("div")
    const rect = div.getBoundingClientRect()
    report_rect(rect)
  })
  ```
  note that it returns a signal, which starts with an `undefined` value, but gets updated after every render.  
  ```ts
  const div = use.defer(() => document.querySelector("div"))

  console.log(div.value)
    // undefined (until the first render is complete)

  const handleClick = () => console.log(div.value)
    // HTMLDivElement (after the first render)
  ```

### signal hooks
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
  count.load(async() => fetchCount("/count"))
  ```
- **use.load**  
  shorthand for creating an OpSignal, and immediately loading something into it
  ```ts
  const count = use.load(() => fetchCount("/count"))
  ```

### flatstate hooks
- **use.flatstate**  
  create a reactive object *(inspired by [mobx](https://mobx.js.org/) and [snapstate](https://github.com/chase-moskal/snapstate))*
  ```ts
  const state = use.flatstate({count: 0})
  const increment = () => state.count++
  ```

### watch hooks
- **use.watch**  
  rerender when anything under part of a StateTree is changed.  
  *todo: document how this works via `watch.stateTree({})`.*  
  ```ts
  const whatever = use.watch(() => use.context.state.whatever)
  ```

### useful accessors

these are not hooks, just access to useful things you may need, so you're allowed to use them under if statements or whatever.

- **use.context**  
  access to your app's context, for whatever reason
  ```ts
  // access your own things on the context
  use.context.my_cool_thing
  ```
- **use.element**
  access the underlying html element
  ```ts
  use.element.querySelector("p")
  ```
- **use.shadow** ~ *shadowView, shadowComponent*  
  access to the shadow root
  ```ts
  use.shadow.querySelector("slot")
  ```
- **use.attrs** ~ *shadowComponent, lightComponent*  
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

## 🥇 ShadowElement and LightElement – *plain elements*

- they're alternatives to LitElement
- they're used as primitives underlying shadowComponent and lightComponent
- they're useful for cases where you expose public class members on the javascript elements

### ShadowElement — *shadow-dom element*

```ts
import {ShadowElement, mixin, attributes, signal} from "@benev/slate"

  @mixin.css(css`span {color: blue}`)
  @mixin.reactivity()
export class MyGold extends ShadowElement {

  #attrs = attributes(this as ShadowElement, {
    label: String
  })

  #count = signal(0)

  render() {
    return html`
      <span>${this.#count.value}</span>
      <button @click=${() => this.#count.value++}>
        ${this.#attrs.label}
      </button>
    `
  }
}
```

- note the usage of `mixin.reactivity`, which allows you to make ShadowElement, LightElement, or LitElement, reactive to slate's state management features like signals or flatstate.

### LightElement — *light-dom element*

```ts
import {LightElement, mixin, attributes, flat} from "@benev/slate"

  @mixin.reactivity()
export class MySilver extends LightElement {

  #attrs = attributes(this as LightElement, {
    label: String
  })

  #state = flat.state({
    count: 0,
  })

  render() {
    return html`
      <span>${this.#state.count}</span>
      <button @click=${() => this.#state.count++}>
        ${this.#attrs.label}
      </button>
    `
  }
}
```

### deploying plain elements

```ts
register_to_dom({MyGold, MySilver})
```

<br/>
<br/>

# 🛠️ standalone utilities

if you're using components and views, you'll probably be using these utilities via the `use` hooks, which will provide a better developer experience.

however, the following utilities are little libraries in their own right, and can be used in a standalone capacity.

<br/>

## 🛎️ signals

signals are a simple form of state management.

this implementation is inspired by [preact signals](https://preactjs.com/blog/introducing-signals/).

- **signals** — they hold values
  ```ts
  import {signal, signals} from "@benev/slate"

  const count = signal(0)
  const greeting = signal("hello")

  count.value++
  greeting.value = "bonjour"

  console.log(count.value) //> 1
  console.log(greeting.value) //> "bonjour"
  ```
- **reaction** — react when signals change
  ```ts
  signals.reaction(() => console.log("doubled", count.value * 2))
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
  const json = signals.op<MyJson>()

  console.log(json.isLoading()) //> true

  await json.load(async() => {
    const data = await fetch_remote_data()
    return JSON.parse(data)
  })

  console.log(json.isReady()) //> true
  console.log(json.payload) //> {"your": "json data"}
  ```
- **computed** — signal derived from other signals
  ```ts
  count.value = 1

  const tripled = signals.computed(() => count.value * 3)

  console.log(tripled.value) //> 3
  ```
- **wait** — for debounced tracking
  ```ts
  const tripled = signals.computed(() => count.value * 3)
  console.log(tripled.value) //> 3

  count.value = 10
  console.log(tripled.value) //> 3 (too soon!)

  await signals.wait
  console.log(tripled.value) //> 30 (there we go)
  ```
- **signal tower**
  ```ts
  import {SignalTower} from "@benev/slate"

  const signals = new SignalTower()
  ```
  - slate comes with a default tower called `signals`, but you can create your own
  - signal towers are completely separated from one another

<br/>

## 🥞 flatstate

flatstate help you create state objects and react when properties change.

flatstate is inspired by mobx and snapstate, but designed to be simpler. flatstate only works on *flat* state objects. only the *direct* properties of state objects are tracked for reactivity. this simplicity helps us avoid weird edge-cases or unexpected footguns.

### flatstate basics

- make a flat state object
  ```ts
  import {flat} from "@benev/slate"

  const state = flat.state({count: 0})
  ```
- simple reaction
  ```ts
  flat.reaction(() => console.log(state.count))
  ```
  - flatstate immediately runs the function, and records which properties it reads
  - then, anytime one of those recorded properties changes, it runs your function again
  - your reaction can listen to more than one state object
- two-function reaction
  ```ts
  flat.reaction(

    // your "collector" function
    () => ({count: state.count}),

    // your "responder" function
    ({count}) => console.log(count),
  )
  ```
  - now there's a separation between your "collector" and your "responder"
  - the collector "passes" relevant data to the responder function
  - flatstate calls the responder whenever that data changes
- stop a reaction
  ```ts
  const stop = flat.reaction(() => console.log(state.count))

  stop() // end this particular reaction
  ```
- reactions are debounced -- so you may have to wait to see state changes
  ```ts
  const state = flat.state({amount: 100})

  state.amount = 101
  console.log(state.amount) //> 100 (old value)

  await flat.wait
  console.log(state.amount) //> 101 (now it's ready)
  ```

### flatstate advanced

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
- multiple flatstate instances are totally isolated from each other
  ```ts
  const flat1 = new Flat()
  const flat2 = new Flat()
  ```

### flatstate integration with frontend elements

- let your components rerender on flat state changes
  ```ts
  import {apply} from "@benev/slate"

  const MyElement2 = mixin.flat(flat)(MyElement)
    // can also be a class decorator

  const elements2 = apply.flat(flat)(elements)
  ```
  - this works on any BaseElement, which includes LitElement, ShadowElement, LightElement

<br/>

## ☢️ reactor

create reactions that listen to both signals and flatstates at the same time.

signals and flat both share the same reaction syntax, but they are separate state management systems. `reactor` lets you combine both.

slate components and views are already wired up to the reactor and will respond to changes automatically. you only need the reactor when you want to respond to state changes when you're *outside* of slate components or views.

- you can use one-function reaction syntax:
  ```ts
  import {reactor, flatstate, signal} from "@benev/slate"

  const state = state({count: 0})
  const count = signal(0)

  // use the reactor to setup a reaction
  reactor.reaction(() => console.log(`
    flat count is ${state.count},
    signal count is ${count.value}
  `))
  ```
- two-function reaction syntax:
  ```ts
  reactor.reaction(
    () => ({a: state.count, b: count.value}),
    results => console.log(results),
  )
  ```
- reactions can be stopped:
  ```ts
  const stop = reactor.reaction(
    () => console.log(state.count)
  )

  // end this reaction
  stop()
  ```
- wait for the debouncer:
  ```ts
  await reactor.wait
  ```

<br/>

## 💫 ops

utility for ui loading/error/ready states.

useful for implementing async operations that involve loading indicators.

you get a better dev-experience if you use ops via signals, but here is the documentation for plain ops on their own, without signals.

- create some ops
  ```ts
  import {Op} from "@benev/slate"

  Op.loading()
    //= {status: "loading"}

  Op.error("a fail occurred")
    //= {status: "error", reason: "a fail occurred"}

  Op.ready(123)
    //= {status: "ready", payload: 123}
  ```
- check an op's status (proper typescript type guards)
  ```ts
  Op.is.loading(op)
    //= false

  Op.is.error(op)
    //= false

  Op.is.ready(op)
    //= true
  ```
- grab an op's payload (undefined when not ready)
  ```ts
  const count = Op.ready(123)
  const loadingCount = Op.loading()

  Op.payload(count)
    //= 123

  Op.payload(loadingCount)
    //= undefined
  ```
- run an async operation which updates an op
  ```ts
  let my_op = Op.loading()

  await Op.load(

    // your setter designates which op to overwrite
    op => my_op = op,

    // your async function which returns the ready payload
    async() => {
      await nap(1000)
      return 123
    }
  )
  ```
- **ops signals integration** — i recommend trying `use.op()` or `signals.op()` to create `OpSignal` instances which have nicer ergonomics *(an OpSignal is just an op that is wrapped in a signal, plus some handy methods)*
  ```ts
  const count = signals.op()

  // run an async operation
  await count.load(async() => {
    await sleep(1000)
    return 123
  })

  // check the status of this OpSignal
  count.isLoading() //= false
  count.isError() //= false
  count.isReady() //= true

  // grab the payload (undefined when not ready)
  count.payload //= 123

  // directly assign the op signal
  count.setLoading()
  count.setError("big fail")
  count.setReady(123)
  ```
- **loading effects for ops**
  - i precooked some ascii loading indicators for you. import 'em:
  ```ts
  import {loading} from "@benev/slate"
  ```
  - then use 'em in your views or whatever.
  ```ts
  return loading.binary(videoOp, video => html`
    <p>video is done loading!</p>
    ${video}
  `)
  ```
  - these loading effects can accept ops or op signals.
  - to make your own, you can use the helpers `makeLoadingEffect` or `makeAnimatedLoadingEffect` *(if you can figure out how to use 'em)*

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
- call `.done()` when you want to return the result

<br/>

## 🧐 more useful utils

ain't got no time to document these, but they're there

- `debounce` — my trusty debouncer
- `deep` — utilities for data structures like 'equal' and 'freeze'
- `is` — proper type guards
- `ob` — map over an object's values with `ob(object).map(fn)`
- `ev` — to listen for events
- `el` — small syntax to generate html without lit
- `nap` — sleep for x milliseconds
- `explode_promise` — make an inside-out promise
- `generate_id` — generate a crypto-random hexadecimal id string
- `pubsub` — easy pub/sub tool
- `requirement` — pass required data to a group of things
- `ShockDrop` and `ShockDragDrop` — for drag-and-drop integrations
- `watch` — new heavy-duty state management pattern, with deep-watching in state trees, formalized actions, and even undo/redo history

