# React Purely Stateful

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

const MyComponent = ({text, setText}) => {
    return <input value={text} onChange={(e) => setText(e.target.value)} />
}

const initialState = { text: "initial value" }

export default stateful(initialState)(TestComponent)
```

### Documentaion
- [API](docs/api.md)
  - [`stateful([mapStateToProps], [mapSetStateToProps], [mergeProps], [options]`](docs/api.md#stateful)