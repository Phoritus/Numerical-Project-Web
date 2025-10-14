import { multiply, dot, subtract } from 'mathjs';

export default class ConjugateGradient {
  constructor(matrixA, vectorB, initialGuess, tolerance, maxIterations = 1000) {
    this.A = matrixA;
    this.B = vectorB;
    this.x0 = initialGuess;
    this.tolerance = tolerance;
    this.maxIterations = maxIterations;
    this.n = matrixA.length;
  }

  calculate() {
    const n = this.n;
    const A = this.A;
    const B = this.B;
    const X = this.x0.slice();
    const history = [];

    // Initial residual r0 = b - A x0
    let R = subtract(B, multiply(A, X));
    // Initial direction p0 = r0 (standard CG)
    let P = R.slice();
    let rsold = dot(R, R);

    let iter = 0;
    while (Math.sqrt(rsold) > this.tolerance && iter < this.maxIterations) {
      const AP = multiply(A, P);
      const alpha = rsold / dot(P, AP);

      // x_{k+1} = x_k + alpha * p_k
      for (let i = 0; i < n; i++) X[i] += alpha * P[i];

      // r_{k+1} = r_k - alpha * A p_k
      R = subtract(R, multiply(alpha, AP));

      const rsnew = dot(R, R);
      history.push({ currentX: X.slice(), residual: R.slice(), alpha, error: Math.sqrt(rsnew), iteration: iter + 1 });

      if (Math.sqrt(rsnew) < this.tolerance) {
        iter++;
        rsold = rsnew;
        break;
      }

      const beta = rsnew / rsold;
      // p_{k+1} = r_{k+1} + beta * p_k
      for (let i = 0; i < n; i++) P[i] = R[i] + beta * P[i];

      rsold = rsnew;
      iter++;
    }

    return { solution: X, iterations: iter, error: Math.sqrt(rsold), history };
  }
}

let testMatrixA = [
  [5, 2, 0, 0],
  [2, 5, 2, 0],
  [0, 2, 5, 2],
  [0, 0, 2, 5]
];

let testMatrixB = [12, 17, 14, 7];
let initialGuess = [0, 0, 0, 0];
let tolerance = 0.0001;
let test = new ConjugateGradient(testMatrixA, testMatrixB, initialGuess, tolerance);
console.log(test.calculate());