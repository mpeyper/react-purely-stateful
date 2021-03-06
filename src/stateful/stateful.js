import shallowEqual from 'recompose/shallowEqual'
import getDisplayName from 'recompose/getDisplayName'
import statefulHOC from '../components/statefulHOC'
import match from '../utils/match'
import stateFactories from './state'
import mapStateToPropsFactories from './mapStateToProps'
import mapSetStateToPropsFactories from './mapSetStateToProps'
import mergePropsFactories from './mergeProps'

const stateful = (
  mapStateToProps,
  mapSetStateToProps,
  mergeProps,
  { pure = true, areStatesEqual = shallowEqual, areOwnPropsEqual = shallowEqual } = {}
) => {
  const initState = match(mapStateToProps, stateFactories)
  const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories)
  const initMapSetStateToProps = match(mapSetStateToProps, mapSetStateToPropsFactories)
  const initMergeProps = match(mergeProps, mergePropsFactories)

  return WrappedComponent => {
    const wrappedComponentName = getDisplayName(WrappedComponent)

    return statefulHOC(WrappedComponent, {
      initState,
      initMapStateToProps,
      initMapSetStateToProps,
      initMergeProps,
      pure,
      areOwnPropsEqual,
      areStatesEqual,
      wrappedComponentName
    })
  }
}

export default stateful
