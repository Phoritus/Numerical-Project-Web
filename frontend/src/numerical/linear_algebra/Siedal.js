export default class Siedal {
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
    let A = this.A; let B = this.B;
    let X = Array(n).fill(0);
    let P = this.x0;
    let errorPercent = Array(n).fill(Infinity);
    const history = [];
    let iter = 0;
    
    do {
      for (let j = 0; j < n; j++) {
        let sum = 0;

        for (let k = 0; k < n; k++) {
          if (k !== j) sum += A[j][k] * P[k];
        }
        X[j] = (B[j] - sum) / A[j][j];
        if (X[j] !== 0) errorPercent[j] = Math.abs((X[j] - P[j]) / X[j]) * 100;
        else errorPercent[j] = Math.abs(X[j] - P[j]) * 100;
        P[j] = X[j]; // Update P immediately for Gauss-Seidel
      }

      iter++;
      history.push({ currentX: X.slice(), errorPercent: errorPercent.slice(), iteration: iter });
      

    } while (Math.max(...errorPercent) > this.tolerance && iter < this.maxIterations);

    return { solution: X, iterations: iter, errorPercent, history };
  }
}

// let testMatrixA = [
//   [5, 2, 0, 0],
//   [2, 5, 2, 0],
//   [0, 2, 5, 2],
//   [0, 0, 2, 5]
// ];

// let testMatrixB = [12, 17, 14, 7];
// let initialGuess = [0, 0, 0, 0];
// let tolerance = 0.000001;
// let test = new Siedal(testMatrixA, testMatrixB, initialGuess, tolerance);
// console.log(test.calculate());