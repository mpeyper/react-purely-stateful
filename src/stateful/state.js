import isPlainObject from 'lodash/isPlainObject'

const defaultState = null

const initTo = state => () => state

const whenMapStateToPropsIsObject = mapStateToProps => {
  return isPlainObject(mapStateToProps) ? initTo(mapStateToProps) : undefined
}

const whenMapStateToPropsIsMissing = () => {
  return initTo(defaultState)
}

export default [whenMapStateToPropsIsObject, whenMapStateToPropsIsMissing]
