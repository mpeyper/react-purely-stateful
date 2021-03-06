import React from 'react'
import { mount } from 'enzyme'

import stateful from '../../src'

const suppressError = f => {
  const error = console.error // eslint-disable-line no-console
  try {
    console.error = () => {} // eslint-disable-line no-console
    return f()
  } finally {
    console.error = error // eslint-disable-line no-console
  }
}

describe('stateful Tests', () => {
  test('should pass through props', () => {
    let TestComponent = ({ message }) => <p>{message}</p>

    let WrappedComponent = stateful()(TestComponent)

    let testComponent = mount(<WrappedComponent message="expected" />)

    expect(testComponent.html()).toEqual('<p>expected</p>')
  })

  test('should pass state through to props', () => {
    let TestComponent = ({ message }) => <p>{message}</p>

    let WrappedComponent = stateful({ message: 'expected' })(TestComponent)

    let testComponent = mount(<WrappedComponent />)

    expect(testComponent.html()).toEqual('<p>expected</p>')
  })

  test('should pass state setters to props', () => {
    let TestComponent = ({ message, setMessage }) => <button onClick={() => setMessage('expected')}>{message}</button>

    let WrappedComponent = stateful({ message: 'wrong' })(TestComponent)

    let testComponent = mount(<WrappedComponent />)

    testComponent.find('button').simulate('click')

    expect(testComponent.html()).toEqual('<button>expected</button>')
  })

  test('should pass setState to props', () => {
    let TestComponent = ({ message, setState }) => (
      <button onClick={() => setState({ message: 'expected' })}>{message}</button>
    )

    let WrappedComponent = stateful()(TestComponent)

    let testComponent = mount(<WrappedComponent />)

    testComponent.find('button').simulate('click')

    expect(testComponent.html()).toEqual('<button>expected</button>')
  })

  test('should map state to props', () => {
    let TestComponent = ({ message }) => <p>{message}</p>

    let initialState = { messageFromState: 'expected' }

    let mapStateToProps = (state = initialState) => {
      return {
        message: state.messageFromState
      }
    }

    let WrappedComponent = stateful(mapStateToProps)(TestComponent)

    let testComponent = mount(<WrappedComponent />)

    expect(testComponent.html()).toEqual('<p>expected</p>')
  })

  test('should map setState to props', () => {
    let TestComponent = ({ message, setMessage }) => <button onClick={() => setMessage('expected')}>{message}</button>

    let mapSetStateToProps = setState => {
      return {
        setMessage: message => setState({ message })
      }
    }

    let WrappedComponent = stateful({ message: 'wrong' }, mapSetStateToProps)(TestComponent)

    let testComponent = mount(<WrappedComponent />)

    testComponent.find('button').simulate('click')

    expect(testComponent.html()).toEqual('<button>expected</button>')
  })

  test('should merge state setState to props', () => {
    let TestComponent = ({ message, setMessage, reset }) => (
      <div>
        <button className="set" onClick={() => setMessage('wrong')}>
          {message}
        </button>
        <button className="reset" onClick={() => reset()}>
          Reset
        </button>
      </div>
    )

    let mapSetStateToProps = setState => {
      return {
        setMessage: message => setState({ message })
      }
    }

    let mergeProps = (mappedState, mappedSetState) => {
      return {
        ...mappedState,
        ...mappedSetState,
        reset: () => mappedSetState.setMessage(mappedState.initialMessage)
      }
    }

    let WrappedComponent = stateful({ message: 'initial', initialMessage: 'expected' }, mapSetStateToProps, mergeProps)(
      TestComponent
    )

    let testComponent = mount(<WrappedComponent />)

    testComponent.find('.set').simulate('click')
    testComponent.find('.reset').simulate('click')

    expect(testComponent.find('.set').html()).toEqual('<button class="set">expected</button>')
  })

  test('should not re-render if props and have not changed', () => {
    let TestComponent = ({ message, setMessage }) => <button onClick={() => setMessage('expected')}>{message}</button>

    let mapCallCount = 0
    let mapSetStateToProps = setState => {
      mapCallCount++

      return {
        setMessage: message => setState({ message })
      }
    }

    let WrappedComponent = stateful({ message: 'expected' }, mapSetStateToProps)(TestComponent)

    let testComponent = mount(<WrappedComponent />)

    testComponent.find('button').simulate('click')

    expect(mapCallCount).toEqual(1)
  })

  test('should re-render if props and have not changed for non-pure component', () => {
    let TestComponent = ({ message, setMessage }) => <button onClick={() => setMessage('expected')}>{message}</button>

    let mapCallCount = 0
    let mapSetStateToProps = setState => {
      mapCallCount++

      return {
        setMessage: message => setState({ message })
      }
    }

    let WrappedComponent = stateful({ message: 'expected' }, mapSetStateToProps, undefined, { pure: false })(
      TestComponent
    )

    let testComponent = mount(<WrappedComponent />)

    testComponent.find('button').simulate('click')

    expect(mapCallCount).toEqual(2)
  })

  test('should re-render if props and have not changed for non-pure component', () => {
    let TestComponent = ({ message, setMessage }) => <button onClick={() => setMessage('expected')}>{message}</button>

    let mapCallCount = 0
    let mapSetStateToProps = setState => {
      mapCallCount++

      return {
        setMessage: message => setState({ message })
      }
    }

    let WrappedComponent = stateful({ message: 'expected' }, mapSetStateToProps, undefined, { pure: false })(
      TestComponent
    )

    let testComponent = mount(<WrappedComponent />)

    testComponent.find('button').simulate('click')

    expect(mapCallCount).toEqual(2)
  })

  test('should override state equality check', () => {
    let TestComponent = ({ message, setMessage }) => <button onClick={() => setMessage('expected')}>{message}</button>

    let mapCallCount = 0
    let mapSetStateToProps = setState => {
      mapCallCount++

      return {
        setMessage: message => setState({ message })
      }
    }

    let WrappedComponent = stateful({ message: 'expected' }, mapSetStateToProps, undefined, {
      areStatesEqual: (s1, s2) => s1 === s2
    })(TestComponent)

    let testComponent = mount(<WrappedComponent />)

    testComponent.find('button').simulate('click')

    expect(mapCallCount).toEqual(2)
  })

  test('should override state equality check', () => {
    let TestComponent = ({ message }) => <p>{message}</p>

    let mapCallCount = 0
    let mapSetStateToProps = setState => {
      mapCallCount++

      return {
        setMessage: message => setState({ message })
      }
    }

    let WrappedComponent = stateful({ message: 'expected' }, mapSetStateToProps, undefined, {
      areOwnPropsEqual: (s1, s2) => s1 === s2
    })(TestComponent)

    class UpdateWrapper extends React.Component {
      constructor() {
        super()

        this.state = { message: 'expected' }
      }

      render() {
        return (
          <div>
            <button onClick={() => this.setState({ message: 'expected' })}>Test</button>
            <WrappedComponent message={this.state.message} />
          </div>
        )
      }
    }

    let testComponent = mount(<UpdateWrapper />)

    testComponent.find('button').simulate('click')

    expect(mapCallCount).toEqual(2)
  })

  test('should raise error if mapStateToProps is not valid', () => {
    let TestComponent = () => <p>wrong</p>

    expect(() => {
      let WrappedComponent = stateful(true)(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type boolean for mapStateToProps argument when connecting component TestComponent.'
    )

    expect(() => {
      let WrappedComponent = stateful(123)(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type number for mapStateToProps argument when connecting component TestComponent.'
    )

    expect(() => {
      let WrappedComponent = stateful('wrong')(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type string for mapStateToProps argument when connecting component TestComponent.'
    )

    expect(() => {
      let WrappedComponent = stateful(['still wrong'])(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type object for mapStateToProps argument when connecting component TestComponent.'
    )
  })

  test('should raise error if mapSetStateToProps is not valid', () => {
    let TestComponent = () => <p>wrong</p>

    expect(() => {
      let WrappedComponent = stateful({}, true)(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type boolean for mapSetStateToProps argument when connecting component TestComponent.'
    )

    expect(() => {
      let WrappedComponent = stateful({}, 123)(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type number for mapSetStateToProps argument when connecting component TestComponent.'
    )

    expect(() => {
      let WrappedComponent = stateful({}, 'wrong')(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type string for mapSetStateToProps argument when connecting component TestComponent.'
    )

    expect(() => {
      let WrappedComponent = stateful({}, ['still wrong'])(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type object for mapSetStateToProps argument when connecting component TestComponent.'
    )
  })

  test('should raise error if mergeProps is not valid', () => {
    let TestComponent = () => <p>wrong</p>

    expect(() => {
      let WrappedComponent = stateful({}, () => {}, true)(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type boolean for mergeProps argument when connecting component TestComponent.'
    )

    expect(() => {
      let WrappedComponent = stateful({}, () => {}, 123)(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type number for mergeProps argument when connecting component TestComponent.'
    )

    expect(() => {
      let WrappedComponent = stateful({}, () => {}, 'wrong')(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type string for mergeProps argument when connecting component TestComponent.'
    )

    expect(() => {
      let WrappedComponent = stateful({}, () => {}, ['still wrong'])(TestComponent)
      suppressError(() => mount(<WrappedComponent />))
    }).toThrow(
      TypeError,
      'Invalid value of type object for mergeProps argument when connecting component TestComponent.'
    )
  })

  test('should use component display name in display name', () => {
    class TestComponent extends React.Component {
      render() {
        return null
      }
    }

    TestComponent.displayName = 'Connected(TestComponent)'

    const SubspacedComponent = stateful()(TestComponent)

    expect(SubspacedComponent.displayName).toEqual('Stateful(Connected(TestComponent))')
  })

  test('should use component name in display name', () => {
    const TestComponent = () => null

    const SubspacedComponent = stateful()(TestComponent)

    expect(SubspacedComponent.displayName).toEqual('Stateful(TestComponent)')
  })

  test('should use element in display name', () => {
    const SubspacedComponent = stateful()('div')

    expect(SubspacedComponent.displayName).toEqual('Stateful(div)')
  })
})
