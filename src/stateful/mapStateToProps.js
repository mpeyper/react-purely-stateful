import invalidTypeFactory from './invalidTypeFactory'
import isPlainObject from 'lodash/isplainobject'

const defaultMapStateToProps = state => state

const initTo = mapStateToProps => () => mapStateToProps

const whenMapStateToPropsIsFunction = mapStateToProps => {
  return typeof mapStateToProps === 'function' ? initTo(mapStateToProps) : undefined
}

const whenMapStateToPropsIsObject = mapStateToProps => {
  return isPlainObject(mapStateToProps) ? initTo(defaultMapStateToProps) : undefined
}

const whenMapStateToPropsIsMissing = mapStateToProps => {
  return !mapStateToProps ? initTo(defaultMapStateToProps) : undefined
}

export default [
  whenMapStateToPropsIsFunction,
  whenMapStateToPropsIsObject,
  whenMapStateToPropsIsMissing,
  invalidTypeFactory('mapStateToProps')
]
