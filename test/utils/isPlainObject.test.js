import isPlainObject from '../../src/utils/isPlainObject'

describe('isPlainObject Tests', () => {
    test('should pass for plain objects', () => {
        expect(isPlainObject({})).toEqual(true)
        expect(isPlainObject({ foo: "bar" })).toEqual(true)
    })

    test('should not pass for array objects', () => {
        expect(isPlainObject([])).toEqual(false)
        expect(isPlainObject([ "foo", "bar" ])).toEqual(false)
    })

    test('should not pass for functions', () => {
        expect(isPlainObject(() => {})).toEqual(false)
    })

    test('should not pass for numbers', () => {
        expect(isPlainObject(0)).toEqual(false)
        expect(isPlainObject(1.23)).toEqual(false)
    })
})
