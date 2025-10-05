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
    const steps = [];

    for (let j = 0; j < n - 1; j++) {
      for (let i = j + 1; i < n; i++) {
        if (A[j][j] === 0) throw new Error("Division by zero during elimination.");
        let factor = A[i][j] / A[j][j];
        for (let k = 0; k < n; k++) {
          A[i][k] -= factor * A[j][k];
          B[i] -= factor * B[j];
        }
        steps.push({
          matrix: A.map(row => row.slice()),
          vector: B.slice(),
          description: `R${i + 1} = R${i + 1} - (${factor.toFixed(2)})•R${j + 1}`,
          eliminationRow: i,
          pivotRow: j,
          factor: factor
        })
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
        steps.push({
          matrix: A.map(row => row.slice()),
          vector: B.slice(),
          description: `R${j + 1} = R${j + 1} - (${factor.toFixed(2)})•R${i + 1}`,
          eliminationRow: j,
          pivotRow: i,
          factor: factor
        });
      }
    }

    for (let i = 0; i < n; i++) {
      let pivot = A[i][i];
      if (pivot === 0) throw new Error("Division by zero during normalization.");
      for (let j = 0; j < n; j++) {
        A[i][j] /= pivot;
        B[i] /= pivot;
      }
      steps.push({
        matrix: A.map(row => row.slice()),
        vector: B.slice(),
        description: `R${i + 1} = R${i + 1} / (${pivot.toFixed(2)})`,
        eliminationRow: i,
        pivotRow: i,
        factor: 1 / pivot
      });
    }

    return { matrix: A, vector: B, steps: steps };
  }
}

let testMatrixA = [
  [2, 1, -1],
  [-3, -1, 2],
  [-2, 1, 2]
];

let testMatrixB = [8, -11, -3];
let test = new GaussJordan(testMatrixA, testMatrixB);
console.log(test.calculate());