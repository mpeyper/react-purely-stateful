import isPlainObject from 'lodash.isplainobject'

const defaultState = null

const initTo = state => () => state

const whenMapStateToPropsIsObject = mapStateToProps => {
  return isPlainObject(mapStateToProps) ? initTo(mapStateToProps) : undefined
}

const whenMapStateToPropsIsMissing = () => {
  return initTo(defaultState)
}

export default [whenMapStateToPropsIsObject, whenMapStateToPropsIsMissing]
