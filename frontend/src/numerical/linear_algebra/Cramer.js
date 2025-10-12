import { create, all } from "mathjs";
const math = create(all, { implicit: 'show' });

export default class Cramer {
  constructor(A, B) {
    this.A = A;
    this.B = B;
    this.n = A.length;
  }

  determinant(matrix) {
    return math.det(matrix);
  }

  replaceColumn(matrix, columnIndex, newColumn) {
    const modifiedMatrix = matrix.map((row, i) =>
      row.map((value, j) => (j === columnIndex ? newColumn[i] : value))
    );
    return modifiedMatrix;
  }

  calculate() {
    const detA = this.determinant(this.A);
    if (detA === 0) {
      throw new Error("The system has no unique solution (determinant is zero).");
    }

    const solutions = [];
    const steps = [];

    for (let i = 0; i < this.n; i++) {
      const Ai = this.replaceColumn(this.A, i, this.B);
      const detAi = this.determinant(Ai);
      const xi = detAi / detA;
      solutions.push(xi);
      steps.push({
        index: i + 1,
        colIndex: i,
        matrixAi: Ai,
        detAi,
        detA,
        xi,
      });
    }
    return {
      detA: detA,
      matrixA: this.A,
      solutions: solutions,
      steps: steps
    }
  }
}

// let testMatrixA = [
//   [-2, 3, 1],
//   [3, 4, -5],
//   [1, -2, 1]
// ];

// let testMatrixB = [9, 0, -4];
// let test = new Cramer(testMatrixA, testMatrixB);
// console.log(test.calculate());