
import { movingAverage } from './metrics'

describe('movingAverage', () => {
  test('basic window average', () => {
    expect(movingAverage([2,4,6,8], 2).slice(2)).toEqual([5,7])
  })
  // Add: tests that expose edge cases and the off-by-one bug.
  // Implement more tests.
})
