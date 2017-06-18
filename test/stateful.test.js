import React from 'react'
import { mount } from 'enzyme'

import stateful from '../src/stateful'

describe('stateful Tests', () => {

    test('should pass through to props', () => {

        let TestComponent = ({message}) => <p>{message}</p>

        let WrappedComponent = stateful()(TestComponent)

        let testComponent = mount(<WrappedComponent message="expected" />)

        expect(testComponent.html()).toEqual("<p>expected</p>")
    })

    test('should pass state through to props', () => {

        let TestComponent = ({message}) => <p>{message}</p>

        let WrappedComponent = stateful({ message: "expected" })(TestComponent)

        let testComponent = mount(<WrappedComponent />)

        expect(testComponent.html()).toEqual("<p>expected</p>")
    })

    test('should pass setState to props', () => {

        let TestComponent = ({message, setState}) => <button onClick={() => setState({ message: "expected" })}>{message}</button>

        let WrappedComponent = stateful({ message: "wrong" })(TestComponent)

        let testComponent = mount(<WrappedComponent />)

        testComponent.find('button').simulate('click')

        expect(testComponent.html()).toEqual("<button>expected</button>")
    })

    test('should map state to props', () => {

        let TestComponent = ({message}) => <p>{message}</p>

        let initialState = { messageFromState: "expected" }

        let mapStateToProps = (state = initialState) => {
            return {
                message: state.messageFromState
            }
        }

        let WrappedComponent = stateful(mapStateToProps)(TestComponent)

        let testComponent = mount(<WrappedComponent />)

        expect(testComponent.html()).toEqual("<p>expected</p>")
    })

    test('should map setState to props', () => {

        let TestComponent = ({message, setMessage}) => <button onClick={() => setMessage("expected")}>{message}</button>

        let mapSetStateToProps  = (setState) => {
            return {
                setMessage: (message) => setState({ message })
            }
        }

        let WrappedComponent = stateful({ message: "wrong" }, mapSetStateToProps)(TestComponent)

        let testComponent = mount(<WrappedComponent />)

        testComponent.find('button').simulate('click')

        expect(testComponent.html()).toEqual("<button>expected</button>")
    })
})