
export function movingAverage(series: number[], window: number): number[] {
  // BUG: off-by-one and doesn't handle window > series.length or zero/negative window
  const out: number[] = []
  for (let i = 0; i < series.length; i++) {
    if (i < window) {
      out.push(series[i] / window) // wrong: partial window handling
      continue
    }
    let sum = 0
    for (let j = i - window; j <= i; j++) sum += series[j]
    out.push(sum / window) // wrong: divides by window but sums window+1
  }
  return out
}
