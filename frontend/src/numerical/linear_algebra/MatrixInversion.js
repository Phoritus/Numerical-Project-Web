import { create, all } from "mathjs";
const math = create(all, { implicit: "show" });

export default class MatrixInversion {
  constructor(A, B) {
    this.A = A;
    this.B = B;
    this.n = A.length;
  }

  calculate() {
    const n = this.n;
    let A = this.A.map(row => row.slice());
    let B = this.B.slice();
    let inverseA = math.identity(n).toArray();

    for (let j = 0; j < n - 1; j++) {
      for (let i = j + 1; i < n; i++) {
        if (A[j][j] === 0) throw new Error("Division by zero during elimination.");
        let factor = A[i][j] / A[j][j];
        for (let k = 0; k < n; k++) {
          A[i][k] -= factor * A[j][k];
          inverseA[i][k] -= factor * inverseA[j][k];
        }
      }
    }

    for (let i = n - 1; i > 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (A[i][i] === 0) throw new Error("Division by zero during back substitution.");
        let factor = A[j][i] / A[i][i];
        for (let k = 0; k < n; k++) {
          A[j][k] -= factor * A[i][k];
          inverseA[j][k] -= factor * inverseA[i][k];
        }
      }
    }

    for (let i = 0; i < n; i++) {
      let pivot = A[i][i];
      if (pivot === 0) throw new Error("Division by zero during normalization.");
      for (let j = 0; j < n; j++) {
        A[i][j] /= pivot;
        inverseA[i][j] /= pivot;
      }
    }

    let x = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        x[i] += inverseA[i][j] * B[j];
      }
    }

    return { A, B, inverseA, x };
  }
}

// let testMatrixA = [
//   [1, 2, 1],
//   [2, 1, -1],
//   [1, -1, 2]
// ];
// let testMatrixB = [6, 1, 5];
// let test = new MatrixInversion(testMatrixA, testMatrixB);
// console.log(test.calculate());