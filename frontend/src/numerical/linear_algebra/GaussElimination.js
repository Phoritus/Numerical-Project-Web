export default class GaussElimination {
  constructor(A, B) {
    this.A = A;
    this.B = B;
    this.n = A.length;
  }

  calculate() {
    const n = this.n;
    let A = this.A.map(row => row.slice());
    let B = this.B.slice();

    for (let j = 0; j < n - 1; j++) {
      for (let i = j + 1; i < n; i++) {
        if (A[j][j] === 0) {
          throw new Error("Division by zero detected during elimination.");
        }
        const factor = A[i][j] / A[j][j];
        for (let k = j; k < n; k++) {
          A[i][k] -= factor * A[j][k];
        }
        B[i] -= factor * B[j];
      }
    }

    let x = Array(n).fill(0);
    let sum;

    for (let i = n - 1; i >= 0; i--) {
      sum = B[i];
      for (let j = i + 1; j < n; j++) {
        sum -= A[i][j] * x[j];
      }
      x[i] = sum / A[i][i];
    }

    return { solution: x };
  }
}