import invalidTypeFactory from './invalidTypeFactory'

const defaultMergeProps = (stateProps, setStateProps, ownProps) => ({ ...ownProps, ...stateProps, ...setStateProps })

const initTo = mergeProps => () => mergeProps

const whenMergePropsIsFunction = mergeProps => {
  return typeof mergeProps === 'function' ? initTo(mergeProps) : undefined
}

const whenMergePropsIsMissing = mergeProps => {
  return !mergeProps ? initTo(defaultMergeProps) : undefined
}

export default [whenMergePropsIsFunction, whenMergePropsIsMissing, invalidTypeFactory('mergeProps')]
