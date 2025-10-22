import { movingAverage } from "./metrics";
import { it, expect, describe } from "@jest/globals";

describe("movingAverage", () => {

  it('basic window average', () => {
    expect(movingAverage([2, 4, 6, 8], 2).slice(2)).toEqual([5, 7])
  })

  it("computes correct averages for a simple case", () => {
    expect(movingAverage([10, 20, 30, 40, 50], 3))
      .toEqual([NaN, NaN, 20, 30, 40]);
  });

  it("throws an error when window is zero or negative", () => {
    expect(() => movingAverage([1, 2, 3], 0)).toThrow();
    expect(() => movingAverage([1, 2, 3], -1)).toThrow();
  });

  it("throws an error when window is larger than the series length", () => {
    expect(() => movingAverage([1, 2], 3)).toThrow();
  });

  it.each([
    { series: [1, 2, 3, 4], window: 2, expected: [NaN, 1.5, 2.5, 3.5] },
    { series: [5, 5, 5, 5], window: 3, expected: [NaN, NaN, 5, 5] },
    { series: [10, 20, 30], window: 1, expected: [10, 20, 30] },
  ])(
    "returns $expected for series $series with window $window",
    ({ series, window, expected }) => {
      expect(movingAverage(series, window)).toEqual(expected);
    }
  );
});
