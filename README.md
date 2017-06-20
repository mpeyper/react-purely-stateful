React Purely Stateful
---------------------
[![Build Status](https://img.shields.io/travis/mpeyper/react-purely-stateful/master.svg?style=flat-square)](https://travis-ci.org/mpeyper/react-purely-stateful) 
[![npm version](https://img.shields.io/npm/v/react-purely-stateful.svg?style=flat-square)](https://www.npmjs.com/package/react-purely-stateful) 
[![npm downloads](https://img.shields.io/npm/dm/react-purely-stateful.svg?style=flat-square)](https://www.npmjs.com/package/react-purely-stateful)
[![License: MIT](https://img.shields.io/npm/l/react-purely-stateful.svg?style=flat-square)](LICENSE.md)

If you prefer to write functional components, but have a need to manage a small amount of state, but don't want to go through all the boilerplate of Redux (or your external statment management library of choice), then the `stateful` higher-order component is just what you're after.

Inspired by the [React Redux bindings](https://github.com/reactjs/react-redux), `stateful` allows you to seperate the state and view into container and presentational components so you can enjoy all the simplicity of functional components, with the addition of some stateful behaviour.

This is ideal for those small pieces of state that don't belong with your application state, such as temporary text in an `input`, the open state of a menu, the currently selected tab, or many other things that only the single component cares about.  Redux (or your external statment management library of choice) is still recommended for any application state you want to store.

## Installation

### NPM

```
npm install --save react-purely-stateful
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) to consume [CommonJS modules](http://webpack.github.io/docs/commonjs.html).

## Usage

### Basic

```
import stateful from 'react-purely-stateful'

const MyComponent = ({text, setState}) => {
    return <input value={text} onChange={(e) => setState({ text: e.target.value })} />
}

export default stateful()(TestComponent)
```

##### With initial state

```
import stateful from 'react-purely-stateful'

const MyComponent = ({text, setState}) => {
    return <input value={text} onChange={(e) => setState({ text: e.target.value })} />
}

const initialState = { text: "initial value" }

export default stateful(initialState)(TestComponent)
```

### Presentation of State

```
import stateful from 'react-purely-stateful'

const MyComponent = ({text, setText}) => {
    return <input value={text} onChange={(e) => setText(e.target.value)} />
}

const mapStateToProps = (state) => {
    return {
        text: state.myText
    }
}

const mapSetStateToProps = (setState) => {
    return {
        setText: (myText) => setState({ myText })
    }
}

export default stateful(mapStateToProps, mapSetStateToProps)(TestComponent)
```

##### With initial state

```
import stateful from 'react-purely-stateful'

const MyComponent = ({text, setText}) => {
    return <input value={text} onChange={(e) => setText(e.target.value)} />
}

const initialState = { myText: "initial value" }

const mapStateToProps = (state = initialState) => {
    return {
        text: state.myText
    }
}

const mapSetStateToProps = (setState) => {
    return {
        setText: (myText) => setState({ myText })
    }
}

export default stateful(mapStateToProps, mapSetStateToProps)(TestComponent)
```

### Props

```
import stateful from 'react-purely-stateful'

const MyComponent = ({text, setText}) => {
    return <input value={text} onChange={(e) => setText(e.target.value)} />
}

const mapStateToProps = (state, ownProps) => {
    return {
        text: ownProps.prefix + state.text
    }
}

const mapSetStateToProps = (setState, ownProps) => {
    return {
        setText: (text) => setState({ text: text.replace(ownProps.prefix, '') })
    }
}

export default stateful(mapStateToProps, mapSetStateToProps)(TestComponent)
```

### Merging state, setState and props

```
import stateful from 'react-purely-stateful'

const MyComponent = ({text, setText, submit, submitted}) => {
    return (
        <div>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={submit}>Submit</button>
            <p>Submitted: {submitted}</p>
        <div>
    )
}

const mapStateToProps = (state) => {
    return {
        text: state.myText
        submitted: state.submitted
    }
}

const mapSetStateToProps = (setState) => {
    return {
        setText: (myText) => setState({ myText }),
        submit: (text) => setState({ submitted: text })
    }
}

const mergeProps = (mappedState, mappedSetState, ownProps) => {
    return {
        ...mappedState,
        ...mappedSetState,
        submit: () => mappedSetState.submit(ownProps.prefix + mappedState.myText)
    }
}

export default stateful(mapStateToProps, mapSetStateToProps, mergeProps)(TestComponent)
```

### Options

- `pure` - if `true`, shallow compare props and state to determine if the component should update.  If `false`, the component will update on every change.  **NOTE:** Setting this to `false` is not advised. (default: true).

```
import stateful from 'react-purely-stateful'
import { someValue, someSideEffect } from './someSideEffect

const MyComponent = ({text, setState}) => {
    return (
        <div>
            <p>{text} - {someValue}</p>
            <button value={text} onChange={someSideEffect}>Go!</button>
        </div>
    )
}

const initialState = { text: "Side Effects!" }

const options = { pure: false }

export default stateful(initialState, undefined, undefined, options)(TestComponent)
```
