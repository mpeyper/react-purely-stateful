import React from 'react'
import shallowEqual from 'fbjs/lib/shallowEqual'
import match from '../utils/match'
import stateFactories from './state'
import mapStateToPropsFactories from './mapStateToProps'
import mapSetStateToPropsFactories from './mapSetStateToProps'
import mergePropsFactories from './mergeProps'

const statefulHOC = (
    WrappedComponent, 
    {
        initState, 
        initMapStateToProps, 
        initMapSetStateToProps,
        initMergeProps,
        ...options
    }
) => {
    class Stateful extends React.Component {
        constructor() {
            super()

            this.state = initState(options)
            this.mapStateToProps = initMapStateToProps(options, this.state)
            this.mapSetStateToProps = initMapSetStateToProps(options, this.state)
            this.mergeProps = initMergeProps(options, this.state)
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (options.pure) {
                return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
            }

            return true
        }

        render() {
            const mappedState = this.mapStateToProps(this.state || undefined , this.props)
            const mappedSetState = this.mapSetStateToProps(this.setState.bind(this), this.props)
            const mergedProps = this.mergeProps(mappedState, mappedSetState, this.props)

            return <WrappedComponent {...mergedProps} />
        }
    }

    Stateful.displayName = options.displayName

    return Stateful
}

const stateful = (
    mapStateToProps, 
    mapSetStateToProps, 
    mergeProps, 
    { pure = true } = {}
) => {

    const initState = match(mapStateToProps, stateFactories, 'state')
    const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps')
    const initMapSetStateToProps = match(mapSetStateToProps, mapSetStateToPropsFactories, 'mapSetStateToProps')
    const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps')

    return (WrappedComponent) => {
        const wrappedComponentName = WrappedComponent.displayName
            || WrappedComponent.name
            || 'Component'

        return statefulHOC(WrappedComponent, {
            initState, 
            initMapStateToProps, 
            initMapSetStateToProps,
            initMergeProps,
            pure,
            wrappedComponentName,
            displayName: `Stateful(${wrappedComponentName}`
        })
    }
}

export default stateful