
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

### most devs misunderstand how to leverage web components.

you're not supposed to make your whole app out of web components.  
they're too cumbersome — web components are html-native, not typescript-native — so they don't take typesafe props, they're referred to by html tag names with poor ide support, and juggling their dom registrations is a pain.

this is why **views** are important, and are a central feature of *slate* — views are almost the same as components (they can use shadow-dom), except that views are ergonomically handled via javascript, they accept props, they don't need registration (they're simply imported) — and views enjoy full typescript typings.

you want to think of web components as the tip of your iceberg — they are the entrypoints to your ui — they are the universal control surfaces to help html authors interact with your systems — but below the surface, most of your internals can be made of easily-composable views.

<br/>

## 👷 quick start

1. install slate
    ```sh
    npm i @benev/slate
    ```
1. prepare your app's frontend and context
    ```ts
    import {Slate, Context} from "@benev/slate"

    export const slate = new Slate(
      new class extends Context {

        // this theme is applied to all your components and views
        theme = css`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `

        // add anything app-level you'd like to make widely available
        my_cool_thing = {my_awesome_data: 123}
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

### `slate.shadow_component` — *"carbon"*

```ts
const styles = css`span {color: yellow}`

export const MyCarbon = slate.shadow_component({styles}, use => {
  const count = use.signal(0)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

### `slate.light_component` — *"oxygen"*

```ts
export const MyOxygen = slate.light_component(use => {
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

  register_to_dom({
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

### `slate.shadow_view` — *"obsidian"*

```ts
const styles = css`span {color: yellow}`

export const MyObsidian = slate.shadow_view({styles}, use => (start: number) => {
  const count = use.signal(start)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

- **`auto_exportparts` is enabled by default.**
  - auto exportparts is an experimental obsidian feature that makes it bearable to use the shadow dom extensively.
  - if auto_exportparts is enabled, and you provide the view a `part` attribute, then it will automatically re-export all internal parts, using the part as a prefix.
  - thus, parts can bubble up: each auto_exportparts shadow boundary adds a new hyphenated prefix, so you can do css like `::part(search-input-icon)`.

### `slate.light_view` — *"quartz"*

```ts
export const MyQuartz = slate.light_view(use => (start: number) => {
  const count = use.signal(start)
  const increment = () => count.value++

  return html`
    <span>${count}</span>
    <button @click=${increment}>increment</button>
  `
})
```

### deploying your views

- **use a quartz view**
  ```ts
  html`<div>${MyQuartz(123)}</div>`
  ```
  - quartz views are beautifully simple
  - they just take props as arguments
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
          attrs: {part: "cool", "data-whatever": true},
        })}
      </div>
    `
    ```

<br/>

## 🪝 `use` hooks — for views and components

### core hooks
- **use.state**  
  works like react useState hook
  ```ts
  const [count, setCount] = use.state(0)
  const increment = () => setCount(count + 1)
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
  count.run(async() => fetchCount("/count"))
  ```

### flatstate hooks
- **use.flatstate**  
  create a reactive object *(inspired by [mobx](https://mobx.js.org/) and [snapstate](https://github.com/chase-moskal/snapstate))*
  ```ts
  const state = use.flatstate({count: 0})
  const increment = () => state.count++
  ```

### useful accessors
- **use.context**  
  access to your app's context, for whatever reason
  ```ts
  // access your own things on the context
  use.context.my_cool_thing
  ```
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

## 🥇 plain elements — gold and silver

gold and silver are "plain" elements, which are alternatives to LitElement.  
they're used as primitives underlying our carbon and oxygen components.  
for most cases you probably want to stick with carbon/oxygen, and only use gold/silver when you're doing some funky sorcery, or you yearn to go back to a simpler time, without hooks.

consider these imports for the following examples:

```ts
import {GoldElement, SilverElement, attributes, flat} from "@benev/slate"
```

### gold element — *shadow-dom element*

```ts
export class MyGold extends GoldElement {
  static get styles() { return css`span {color: blue}` }

  #attrs = attributes(this as GoldElement, {
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

### silver element — *light-dom element*

```ts
export class MySilver extends SilverElement {

  #attrs = attributes(this as SilverElement, {
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

if you want plain elements to have reactivity or have the context's css theme applied, you'll want to run them through `slate.components` before you register them:

```ts
register_to_dom({
  ...slate.components({
    MyGold,
    MySilver,
  }),
})
```

<br/>

## 🔮 deferred context

you can extend the context with anything you'd like to make easily available to your components and views:

```ts
export const slate = new Slate(
  new class extends Context {
    my_cool_thing = {my_awesome_data: 123}
  }
)
```

but since your components are importing `slate`, the above example creates the context *at import-time.*

you may instead prefer to *defer* the creation of your context until later, at *run-time:*

```ts
// define your context class
export class MyContext extends Context {
  my_cool_thing = {my_awesome_data: 123}
}

// create slate *without yet* instancing the context
export slate = new Slate<MyContext>()

//
// ... later in another file,
// maybe in your main.ts ...
//

// instance and assign your context, now, at runtime
slate.context = new MyContext()

// just be sure to assign context *before* you register your components
register_to_dom(myComponents)
```

<br/>
<br/>

# 🛠️ standalone utilities

if you're using slate's frontend components and views, you'll probably be using these utilities via the `use` hooks, which will provide a better developer experience.

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
  - this works on any BaseElement, which includes LitElement, GoldElement, SilverElement, carbon, and oxygen

<br/>

## ☢️ reactor

create reactions that listen to both signals and flatstates at the same time.

signals and flat both share the same reaction syntax, but they are separate state management systems. `reactor` lets you combine both.

- you can use one-function reaction syntax:
  ```ts
  import {reactor, flat, signals} from "@benev/slate"

  const state = flat.state({count: 0})
  const count = signals.signal(0)

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
- call `.done()` when you want to return the result

<br/>

## 🧐 more useful utils

no time to document these fully, but they're there

- `debounce` — is a pretty good debouncer
- `deep` — utilities for data structures like 'equal' and 'freeze'
- `is` — proper type guards
- `explode_promise` — make an inside-out promise
- `generate_id` — generate a crypto-random hexadecimal id string
- `pub` — easy pub/sub tool
- `requirement` — pass required data to a group of things

