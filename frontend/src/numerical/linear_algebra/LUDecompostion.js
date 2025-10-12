import { create, all } from "mathjs";
const math = create(all, { implicit: 'show' });

export default class LUDecomposition {
  constructor(A, B) {
    this.A = A;
    this.B = B;
    this.n = A.length;
  }

  calculate() {
    const n = this.n;
    let L = Array.from({ length: n }, () => Array(n).fill(0));
    let U = Array.from({ length: n }, () => Array(n).fill(0));
    let y = Array(n).fill(0);
    let x = Array(n).fill(0);
    let sum;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        sum = 0;
        for (let k = 0; k < i; k++) {
          sum += L[i][k] * U[k][j];
        }
        L[i][j] = this.A[i][j] - sum;
      }

      for (let j = i; j < n; j++) {
        sum = 0;
        for (let k = 0; k < i; k++) {
          sum += L[i][k] * U[k][j];
        }
        U[i][j] = (this.A[i][j] - sum) / L[i][i];
      }
    }

    for (let i = 0; i < n; i++) {
      sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * y[j];
      }
      y[i] = (this.B[i] - sum) / L[i][i];
    }

    for (let i = n - 1; i >= 0; i--) {
      sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += U[i][j] * x[j];
      }
      x[i] = (y[i] - sum) / U[i][i]; // Assuming C is a zero vector
    }

    return { vector: x };
  }
  
}

// const testMatrixA = [
//   [4, 3, 1],
//   [2, 1, 3],
//   [6, 5, 4]
// ]

// const testMatrixB = [1, 2, 3];

// const luTest = new LUDecomposition(testMatrixA, testMatrixB);
// console.log(luTest.calculate());