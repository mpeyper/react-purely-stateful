import React from 'react'
import shallowEqual from 'fbjs/lib/shallowEqual'

const defaultMapStateToProps = (state) => state
const defaultMapSetStateToProps = (setState) => ({ setState })
const defaultMergeProps = (mappedState, mappedSetState, ownProps) => ({ ...mappedState, ...mappedSetState, ...ownProps })
const defaultOptions = { pure: true }

const stateful = (
    mapStateToProps = defaultMapStateToProps, 
    mapSetStateToProps = defaultMapSetStateToProps, 
    mergeProps = defaultMergeProps, 
    options = defaultOptions
) => {
    const statefulOptions = { ...defaultOptions, ...options }
    
    return (Component) => {
        class StatefulWrapper extends React.Component {
            constructor() {
                super()

                if (typeof mapStateToProps !== 'function') {
                    this.state = mapStateToProps
                    mapStateToProps = defaultMapStateToProps
                }
            }

            shouldComponentUpdate(nextProps, nextState) {
                if (statefulOptions.pure) {
                    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
                }

                return true
            }

            render() {
                const mappedState = mapStateToProps(this.state || undefined , this.props)
                const mappedSetState = mapSetStateToProps(this.setState.bind(this), this.props)
                const mergedProps = mergeProps(mappedState, mappedSetState, this.props)

                return <Component {...mergedProps} />
            }
        }

        return StatefulWrapper
    }
}

export default stateful