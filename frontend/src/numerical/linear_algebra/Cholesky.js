import { create, all } from 'mathjs';
const math = create(all, {implicit: 'show'});

export default class Cholesky {
  constructor(matrixA, vectorB) {
    this.A = matrixA;
    this.B = vectorB;
    this.n = matrixA.length;
  }

  calculate() {
    const n = this.n;
    let L = Array(n).fill(null).map(() => Array(n).fill(0));

    // Cholesky decomposition A = L * L^T
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        if (i === j) {
          let sum = 0;
          for (let k = 0; k < j; k++) {
            sum += L[j][k] * L[j][k];
          }
          L[j][j] = Math.sqrt(this.A[j][j] - sum);
        } else {
          L[i][j] = (this.A[i][j] - L[i].slice(0, j).reduce((acc, _, k) => acc + L[i][k] * L[j][k], 0)) / L[j][j];
        }
      }
    }

    // Solve L * y = B
    let y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      y[i] = this.B[i] - L[i].slice(0, i).reduce((acc, _, k) => acc + L[i][k] * y[k], 0);
    }

    // Solve L^T * X = y
    let X = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      X[i] = (y[i] - L[i].slice(i + 1).reduce((acc, _, k) => acc + L[i][k] * X[k], 0)) / L[i][i];
    }

    return { vector: X};
  }
}

// const testMatrixA = [
//   [4, 12, -16],
//   [12, 37, -43],
//   [-16, -43, 98]
// ];

// const testMatrixB = [1, 2, 3];
// const test = new Cholesky(testMatrixA, testMatrixB);
// console.log(test.calculate());