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

    test('should merge state setState to props', () => {

        let TestComponent = ({message, setMessage, reset}) => (
            <div>
                <button className="set" onClick={() => setMessage("wrong")}>{message}</button>
                <button className="reset" onClick={() => reset()}>Reset</button>
            </div>
        )

        let mapSetStateToProps  = (setState) => {
            return {
                setMessage: (message) => setState({ message })
            }
        }

        let mergeProps  = (mappedState, mappedSetState) => {
            return {
                ...mappedState,
                ...mappedSetState,
                reset: () => mappedSetState.setMessage(mappedState.initialMessage)
            }
        }

        let WrappedComponent = stateful({ message: "initial", initialMessage: "expected" }, mapSetStateToProps, mergeProps)(TestComponent)

        let testComponent = mount(<WrappedComponent />)

        testComponent.find('.set').simulate('click')
        testComponent.find('.reset').simulate('click')

        expect(testComponent.find('.set').html()).toEqual('<button class="set">expected</button>')
    })

    test('should not re-render if props and have not changed', () => {

        let TestComponent = ({message, setMessage}) => <button onClick={() => setMessage("expected")}>{message}</button>

        let mapCallCount = 0;
        let mapSetStateToProps  = (setState) => {
            mapCallCount++

            return {
                setMessage: (message) => setState({ message })
            }
        }

        let WrappedComponent = stateful({ message: "expected" }, mapSetStateToProps)(TestComponent)

        let testComponent = mount(<WrappedComponent />)

        testComponent.find('button').simulate('click')

        expect(mapCallCount).toEqual(1)
    })

    test('should re-render if props and have not changed for non-pure component', () => {

        let TestComponent = ({message, setMessage}) => <button onClick={() => setMessage("expected")}>{message}</button>

        let mapCallCount = 0;
        let mapSetStateToProps  = (setState) => {
            mapCallCount++

            return {
                setMessage: (message) => setState({ message })
            }
        }

        let WrappedComponent = stateful({ message: "expected" }, mapSetStateToProps, undefined, { pure: false })(TestComponent)

        let testComponent = mount(<WrappedComponent />)

        testComponent.find('button').simulate('click')

        expect(mapCallCount).toEqual(2)
    })

    test('should re-render if props and have not changed for non-pure component', () => {

        let TestComponent = ({message, setMessage}) => <button onClick={() => setMessage("expected")}>{message}</button>

        let mapCallCount = 0;
        let mapSetStateToProps  = (setState) => {
            mapCallCount++

            return {
                setMessage: (message) => setState({ message })
            }
        }

        let WrappedComponent = stateful({ message: "expected" }, mapSetStateToProps, undefined, { pure: false })(TestComponent)

        let testComponent = mount(<WrappedComponent />)

        testComponent.find('button').simulate('click')

        expect(mapCallCount).toEqual(2)
    })

    test('should raise error if mapStateToProps is not valid', () => {
        expect(() => stateful(false)).toThrow('mapStateToProps must be a function or a plain object')
        expect(() => stateful(123)).toThrow('mapStateToProps must be a function or a plain object')
        expect(() => stateful("wrong")).toThrow('mapStateToProps must be a function or a plain object')
        expect(() => stateful(["still wrong"])).toThrow('mapStateToProps must be a function or a plain object')
    })

    test('should raise error if mapSetStateToProps is not valid', () => {
        expect(() => stateful({}, false)).toThrow('mapSetStateToProps must be a function')
        expect(() => stateful({}, 123)).toThrow('mapSetStateToProps must be a function')
        expect(() => stateful({}, "wrong")).toThrow('mapSetStateToProps must be a function')
        expect(() => stateful({}, ["still wrong"])).toThrow('mapSetStateToProps must be a function')
    })

    test('should raise error if mergeProps is not valid', () => {
        expect(() => stateful({}, () => {}, false)).toThrow('mergeProps must be a function')
        expect(() => stateful({}, () => {}, 123)).toThrow('mergeProps must be a function')
        expect(() => stateful({}, () => {}, "wrong")).toThrow('mergeProps must be a function')
        expect(() => stateful({}, () => {}, ["still wrong"])).toThrow('mergeProps must be a function')
    })

    test('should raise error if options is not valid', () => {
        expect(() => stateful({}, () => {}, () => {}, false)).toThrow('options must be a plain object')
        expect(() => stateful({}, () => {}, () => {}, 123)).toThrow('options must be a plain object')
        expect(() => stateful({}, () => {}, () => {}, "wrong")).toThrow('options must be a plain object')
        expect(() => stateful({}, () => {}, () => {}, ["still wrong"])).toThrow('options must be a plain object')
        expect(() => stateful({}, () => {}, () => {}, () => "wrong")).toThrow('options must be a plain object')
    })

    test('should not raise error if mapStateToProps is not valid in production', () => {
        const nodeEnv = process.env.NODE_ENV

        try {
            process.env.NODE_ENV = 'production'

            expect(typeof stateful(false)).toEqual("function")
            expect(typeof stateful(123)).toEqual("function")
            expect(typeof stateful("wrong")).toEqual("function")
            expect(typeof stateful(["still wrong"])).toEqual("function")
        } finally {
            process.env.NODE_ENV = nodeEnv
        }
    })

    test('should not raise error if mapSetStateToProps is not valid in production', () => {
        const nodeEnv = process.env.NODE_ENV

        try {
            process.env.NODE_ENV = 'production'

            expect(typeof stateful({}, false)).toEqual("function")
            expect(typeof stateful({}, 123)).toEqual("function")
            expect(typeof stateful({}, "wrong")).toEqual("function")
            expect(typeof stateful({}, ["still wrong"])).toEqual("function")
        } finally {
            process.env.NODE_ENV = nodeEnv
        }
    })

    test('should not raise error if mergeProps is not valid in production', () => {
        const nodeEnv = process.env.NODE_ENV

        try {
            process.env.NODE_ENV = 'production'

            expect(typeof stateful({}, () => {}, false)).toEqual("function")
            expect(typeof stateful({}, () => {}, 123)).toEqual("function")
            expect(typeof stateful({}, () => {}, "wrong")).toEqual("function")
            expect(typeof stateful({}, () => {}, ["still wrong"])).toEqual("function")
        } finally {
            process.env.NODE_ENV = nodeEnv
        }
    })

    test('should not raise error if options is not valid in production', () => {
        const nodeEnv = process.env.NODE_ENV

        try {
            process.env.NODE_ENV = 'production'

            expect(typeof stateful({}, () => {}, () => {}, false)).toEqual("function")
            expect(typeof stateful({}, () => {}, () => {}, 123)).toEqual("function")
            expect(typeof stateful({}, () => {}, () => {}, "wrong")).toEqual("function")
            expect(typeof stateful({}, () => {}, () => {}, ["still wrong"])).toEqual("function")
            expect(typeof stateful({}, () => {}, () => {}, () => "wrong")).toEqual('function')
        } finally {
            process.env.NODE_ENV = nodeEnv
        }
    })
})