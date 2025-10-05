import { create, all, i } from 'mathjs';
const math = create(all, { implicit: 'show' });

export default class GuessElimination {
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

    // Forward elimination
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

    // Back substitution
    let x = Array(n).fill(0);
    const backSubSteps = [];
    let terms = [];
    let sum;

    for (let i = n - 1; i >= 0; i--) {
      sum = B[i];
      terms = [`b_{${i + 1}}`];

      for (let j = i + 1; j < n; j++) {
        sum -= A[i][j] * x[j];
        terms.push(`a_{${i + 1}${j + 1}}x_{${j + 1}}`);
      }
      x[i] = sum / A[i][i];

      let formula = `x_{${i + 1}} = \\dfrac{${terms.join(' - ')}}{a_{${i + 1}${i + 1}}}`;
      backSubSteps.push({
        index: i,
        formula,
        value: x[i],
        numerator: sum,
        denominator: A[i][i],
      });
    }



    return {
      solution: x,
      steps: steps,
      backSubSteps,
      finalMatrix: A,
      finalVector: B
    }

  }
}

// let testMatrixA = [
//   [5, 6, 1],
//   [5, 8, 9],
//   [12, 32, 1]
// ];
// let testMatrixB = [1, 5, 6];

// let solver = new GuessElimination(testMatrixA, testMatrixB);
// console.log(solver.calculate());