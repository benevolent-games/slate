
![](./assets/s.webp)

<br/>

# 🪨 `@benev/slate`

> 🚧 prerelease wip under constructon subject to change

- frontend ui framework
- built on [lit](https://lit.dev/)
- views and web components
- hooks syntax
- state management

<br/>

## 👷 quick start

1. install slate
    ```sh
    npm i @benev/slate
    ```
1. prepare your app's frontend and context
    ```ts
    import {prepare_frontend, Context} from "@benev/slate"

    export const {carbon, oxygen, obsidian, quartz} = (
      prepare_frontend(new class extends Context {
        theme = css`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `
      })
    )
    ```
1. import html and css template functions
    ```ts
    import {html, css} from "@benev/slate"
    ```

<br/>

## ⚙️ components

### define your components

this is how you create web components that are custom html elements.

they can be used in plain html `<my-oxygen></my-oxygen>`.

1. **oxygen** — light-dom element
    ```ts
    export const MyOxygen = oxygen(use => {
      const count = use.signal(0)
      const increment = () => count.value++

      return html`
        <span>${count}</span>
        <button @click=${increment}>increment</button>
      `
    })
    ```
1. **carbon** — shadow-dom element
    ```ts
    const styles = css`span {color: yellow}`

    export const MyCarbon = carbon({styles}, use => {
      const count = use.signal(0)
      const increment = () => count.value++

      return html`
        <span>${count}</span>
        <button @click=${increment}>increment</button>
      `
    })
    ```

### register and use your components

1. register your components to the dom
    ```ts
    import {register_to_dom} from "@benev/slate"

    register_to_dom({
      MyOxygen,
      MyCarbon,
    })
    ```
    - the component names are automatically converted from `CamelCase` to `kebab-case`
1. use your components in any html on the page
  ```html
  <section>
    <my-oxygen></my-oxygen>
    <my-carbon></my-carbon>
  </section>
  ```

<br/>

## 🖼️ views

### define your views

views are like components, but they are not custom html elements.

what's great about them, is that they are javascript functions which are imported and injected into the html templates for other views or components -- and as javascript functions, your IDE can rename them across the codebase, and find-all-references, and you get full typescript typings for their props (whereas html-based web components do not afford you the same luxuries).

views accept js parameters called `props`.

1. **quartz** — light-dom view
    ```ts
    export const MyQuartz = quartz(use => (start: number) => {
      const count = use.signal(start)
      const increment = () => count.value++

      return html`
        <span>${count}</span>
        <button @click=${increment}>increment</button>
      `
    })
    ```
1. **obsidian** — shadow-dom view
    ```ts
    const styles = css`span {color: yellow}`

    export const MyObsidian = obsidian({styles}, use => (start: number) => {
      const count = use.signal(start)
      const increment = () => count.value++

      return html`
        <span>${count}</span>
        <button @click=${increment}>increment</button>
      `
    })
    ```
    - `auto_exportparts` is enabled by default:
      - auto exportparts is an awesome feature that makes it bearable to use the shadow dom extensively.
      - if auto_exportparts is enabled, and you provide the view a `part` attribute, then it will automatically re-export all internal parts, using the part as a prefix
      - thus, parts can bubble up, each shadow boundary adds a new hyphenated prefix, so you can do css like `::part(search-input-icon)`

### using your views

1. import your views
    ```ts
    import {MyQuartz} from "./my-quartz.js"
    import {MyObsidian} from "./my-obsidian.js"
    ```
1. inject your quartz views into any html template like this
    ```ts
    html`
      <aside>
        ${MyQuartz(123)}
      </aside>
    `
    ```
    - quartz views are beautifully simple
    - without any shadow-dom, they have no stylesheet, and without a wrapping element, they have no attributes
1. inject your obsidian views like this
    ```ts
    html`
      <aside>
        ${MyObsidian([123])}
      </aside>
    `
    ```
    - your obsidian views need their props wrapped in an array
1. obsidian views will accept a settings object
    ```ts
    html`
      <aside>
        ${MyObsidian([123], {
          auto_exportparts: true,
          attrs: {
            part: "cool",
            "data-whatever": true,
          },
          content: html`
            <p>slotted content</p>
          `,
        })}
      </aside>
    `
    ```
    - obsidian views are wrapped in a `<obsidian-view>` component
    - this is where the shadow root is attached
    - in the settings object, you can pass attributes, slotted content, etc
    - this is why obsidian views are more complex than their simpler counterparts, quartz views

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
- **use.context**  
    access to your app's context
    ```ts
    await context.flat.wait
    ```
    by default, context has `theme`, `signals`, and `flat`, but you specify your own context in `prepare_frontend`, so you can put any app-level state in there that you might want

### special `use` access

- **use.element** *~ carbon, oxygen, obsidian ~*  
    access the underlying html element
    ```ts
    use.element.querySelector("p")
    ```
- **use.shadow** *~ carbon, obsidian ~*  
    access to the shadow root
    ```ts
    use.shadow.querySelector("slot")
    ```
- **use.attrs** *~ carbon, oxygen ~*  
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

- non-hooks class-based LitElement-alternative components
- `GoldElement` is a shadow-dom component base class
- `SilverElement` is a light-dom component base class
- these are used as primitives underlying carbon/oxygen components
- they do not have context, theme, or any state management reactivity applied
  - you can apply those with the mixins found by importing `mixins`
  - you can use `Attributes.base(this as BaseElement)` to create attribute accessors

### `prepare_frontend` vs `deferred_frontend`

- `prepare_frontend` "bakes" your app context into the component and view functions at import-time, "before" your components and views are defined. this makes your developer experience simple and pleasant.
  - however, if you want to make the theme css customizable (maybe you're authoring a library), or if you need to accept the context object *later* for some reason, this can create a bit of an awkward chicken-vs-egg timing situation.
  - `deferred_frontend` is an alternative designed to solve this problem by deferring the passing of context to each individual component and view.
  - deferred makes your experience more cumbersome, because you have to pass the context into every view before you can use them. deferred_frontend gives you a `provide` function which makes it easy to pass context to a group of views for that purpose.

<br/>

## 🛠️ standalone utilities

more docs coming soon, but for now, read the docs on these utilities that are available in `@benev/slate`

- 🥞 Flatstate [docs](https://github.com/benevolent-games/frog#-flatstate)
- 🪈 Pipe [docs](https://github.com/benevolent-games/frog#-pipe)
- 💫 Op [docs](https://github.com/benevolent-games/frog#-op)
- 🛎️ Signals *(no docs yet)*
