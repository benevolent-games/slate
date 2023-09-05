
![](./assets/s.webp)

<br/>

# 🪨 `@benev/slate`

> 🚧 prerelease wip under constructon subject to change

- frontend ui framework
- lit compatible, uses lit-html for templating
- `GoldElement` is a replacement for LitElement
- `SilverElement` is just like GoldElement but for the light dom
- `ShaleView` is a sophisticated view class
- `Flat` is a state management system
- `Pipe` is cool syntax for.. piping
- `Op` is a system for showing loading spinners
- `prepare_frontend` connects your components and views with app-level context and state management

<br/>

## 👷 recommended setup

1. install slate into your project
    ```sh
    npm i @benev/slate
    ```
1. establish a "context" for your app
    ```ts
    import {css} from "lit"
    import {BaseContext} from "@benev/slate"

    export class Context extends BaseContext {

      // state management system
      flat = new Flat()

      // applied to components and views
      theme = css`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `
    }
    ```
1. prepare your frontend
    ```ts
    export const {component, components, view, views} = prepare_frontend<Context>()
    ```
1. register all your components to the dom
    ```ts
    import {register_to_dom} from `@benev/slate`

    const context = new Context()

    register_to_dom(components(context, {
      MyElement,
      AnotherElement,
      WhateverElement,
    }))
    ```

<br/>

## 🥇 GoldElement

```ts
import {html, css} from "lit"
import {GoldElement} from "@benev/slate"

export const MyElement = component(context => class extends GoldElement {
  static styles = css``

  #state = context.flat.state({
    count: 0,
  })

  #views = views(context, {
    MyView,
  })

  #increment => () => {
    this.#state.count++
  }

  render() {
    return html`
      <p>count: ${this.#state.count}</p>
      <button @click=${this.#increment}>increment</button>
      ${this.#views.MyView({props: [this.#state.count]})}
    `
  }
})
```

<br/>

## 🥈 SilverElement

it's just like `GoldElement`, except it's light dom (no shadow dom), and thus it cannot have its own stylesheet (relies on styling from above).

<br/>

## 🗿 ShaleView

```ts
export const MyView = view(context => class extends ShaleView {
  name = "my-view"
  styles = css``

  render(count: number) {
    return html`<p>${count}</p>`
  }
})
```
- views are very similar to components
- they even have their own shadow dom
- but they are not custom elements
- they don't need to be registered to the dom
- they do this cool thing called `auto_exportparts`
  - it automatically exports shadow parts across many shadow layers
  - it's on by default
  - you just give the view a `part`, and it will use that part as the prefix to any sub-parts
  - so each view auto exports any child parts
  - so when you have a hierarchy of views, parts get exported all the way up to the top, and prefixed too, so you don't have name collisions

<br/>

### more utilities with new docs coming soon

- 🥞 Flatstate [docs](https://github.com/benevolent-games/frog#-flatstate)
- 🪈 Pipe [docs](https://github.com/benevolent-games/frog#-pipe)
- 💫 Op [docs](https://github.com/benevolent-games/frog#-op)

