import invalidTypeFactory from './invalidTypeFactory'

const defaultMapSetStateToPropsFactory = (options, state) => {
    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)
    const stateKeys = Object.keys(state || {}).filter(key => state.hasOwnProperty(key))
  
    return (setState) => {
        const setStateMap = { setState }
        stateKeys.forEach(key => setStateMap[`set${capitalizeFirstLetter(key)}`] = (value) => setState({ [key]: value }))
        return setStateMap
    }
}

const initTo = (mapSetStateToProps) => () => mapSetStateToProps

const whenMapSetStateToPropsIsFunction = (mapSetStateToProps) => {
    return typeof mapSetStateToProps === 'function'
        ? initTo(mapSetStateToProps)
        : undefined
}

const whenMapSetStateToPropsIsMissing = (mapSetStateToProps) => {
    return !mapSetStateToProps
        ? defaultMapSetStateToPropsFactory
        : undefined
}

export default [
    whenMapSetStateToPropsIsFunction,
    whenMapSetStateToPropsIsMissing,
    invalidTypeFactory('mapSetStateToProps')
]
      