export default class GaussJordan {
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
        if (A[j][j] === 0) throw new Error("Division by zero during elimination.");
        let factor = A[i][j] / A[j][j];
        for (let k = 0; k < n; k++) {
          A[i][k] -= factor * A[j][k];
          B[i] -= factor * B[j];
        }
      }
    }

    for (let i = n - 1; i > 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        if (A[i][i] === 0) throw new Error("Division by zero during back substitution.");
        let factor = A[j][i] / A[i][i];
        for (let k = 0; k < n; k++) {
          A[j][k] -= factor * A[i][k];
          B[j] -= factor * B[i];
        }
        
      }
    }

    for (let i = 0; i < n; i++) {
      let pivot = A[i][i];
      if (pivot === 0) throw new Error("Division by zero during normalization.");
      for (let j = 0; j < n; j++) {
        A[i][j] /= pivot;
        B[i] /= pivot;
      }
    }

    return { matrix: A, vector: B };
  }
}

let testMatrixA = [
  [2, 1, -1],
  [-3, -1, 2],
  [-2, 1, 2]
];

// let testMatrixB = [8, -11, -3];
// let test = new GaussJordan(testMatrixA, testMatrixB);
// console.log(test.calculate());