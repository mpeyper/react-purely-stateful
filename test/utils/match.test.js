import match from '../../src/utils/match'

describe('match Tests', () => {
    test('should match first factory', () => {
        const expected = 'result'

        const factory1 = (value) => {
            return value === 1 ? expected : undefined
        }

        const factory2 = (value) => {
            return value !== 1 ? "wrong" : undefined
        }

        expect(match(1, [factory1, factory2])).toEqual(expected)
    })

    test('should match second factory', () => {
        const expected = 'result'

        const factory1 = (value) => {
            return value === 1 ? "wrong" : undefined
        }

        const factory2 = (value) => {
            return value !== 1 ? expected : undefined
        }

        expect(match(2, [factory1, factory2])).toEqual(expected)
    })

    test('should not match any factory', () => {
        const factory1 = (value) => {
            return value === 1 ? "wrong" : undefined
        }

        expect(match(2, [factory1])).toEqual(undefined)
    })
})
