import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

export default (
    WrappedComponent, 
    {
        initState, 
        initMapStateToProps, 
        initMapSetStateToProps,
        initMergeProps,
        pure,
        areStatesEqual,
        areOwnPropsEqual,
        ...options
    }
) => {
    class Stateful extends React.Component {
        constructor() {
            super()

            this.state = initState(options)
            this.mapStateToProps = initMapStateToProps(options)
            this.mapSetStateToProps = initMapSetStateToProps(options, this.state)
            this.mergeProps = initMergeProps(options)
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (pure) {
                return !areOwnPropsEqual(this.props, nextProps) || !areStatesEqual(this.state, nextState)
            }

            return true
        }

        render() {
            const stateProps = this.mapStateToProps(this.state || undefined, this.props)
            const setStateProps = this.mapSetStateToProps(this.setState.bind(this), this.props)
            const mergedProps = this.mergeProps(stateProps, setStateProps, this.props)

            return <WrappedComponent {...mergedProps} />
        }
    }

    Stateful.displayName = `Stateful(${options.wrappedComponentName})`

    hoistNonReactStatics(Stateful, WrappedComponent)

    return Stateful
}
