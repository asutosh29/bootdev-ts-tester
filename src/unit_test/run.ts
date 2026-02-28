// Evaluation function code goes here.
export function averageScore(ratings: number[]): number {
  let sum = 0;
  let n = ratings.length;
  ratings.forEach((e) => (sum += e));
  let avg = sum / n;
  return avg;
}
