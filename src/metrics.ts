export function movingAverage(series: number[], window: number): number[] {
  if (window <= 0) throw new Error("Window must be positive");
  if (window > series.length) throw new Error("Window larger than series");

  const out: number[] = [];
  for (let i = 0; i < series.length; i++) {
    if (i < window - 1) {
      out.push(NaN);
      continue;
    }
    let sum = 0;
    for (let j = i - window + 1; j <= i; j++) {
      sum += series[j];
    }
    out.push(sum / window);
  }
  return out;
}