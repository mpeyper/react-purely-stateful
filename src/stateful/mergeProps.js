const defaultMergeProps = (mappedState, mappedSetState, ownProps) => ({ ...ownProps, ...mappedState, ...mappedSetState })

const initTo = (mergeProps) => () => mergeProps

const whenMergePropsIsFunction = (mergeProps) => {
    return typeof mergeProps === 'function'
        ? initTo(mergeProps)
        : undefined
}

const whenMergePropsIsMissing = (mergeProps) => {
    return !mergeProps
        ? initTo(defaultMergeProps)
        : undefined
}

export default [
    whenMergePropsIsFunction,
    whenMergePropsIsMissing
]
      