import React from 'react'

const defaultMapStateToProps = (state) => state
const defaultMapSetStateToProps = (setState) => ({ setState })
const defaultMergeProps = (mappedState, mappedSetState, ownProps) => ({ ...mappedState, ...mappedSetState, ...ownProps })

const stateful = (mapStateToProps = defaultMapStateToProps, mapSetStateToProps = defaultMapSetStateToProps, mergeProps = defaultMergeProps) => (Component) => {

    class StatefulWrapper extends React.PureComponent {
        constructor() {
            super()

            if (typeof mapStateToProps !== 'function') {
                this.state = mapStateToProps
                mapStateToProps = defaultMapStateToProps
            }
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

export default stateful