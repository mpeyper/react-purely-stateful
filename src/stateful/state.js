import isPlainObject from '../utils/isPlainObject'

const defaultState = null

const initTo = (state) => () => state

const getInitialState = (mapStateToProps) => {
    return isPlainObject(mapStateToProps)
        ? initTo(mapStateToProps)
        : initTo(defaultState)
}

export default [
    getInitialState
]
      