import { create, all } from 'mathjs';
const math = create(all, { implicit: 'show' });

export default class NewtonRaphson {
  constructor(x0, f, tolerance = 1e-6, maxIterations = 1000) {
    try {
      this.expression = f;
      // compile function
      this.compiled = math.parse(f).compile();
      // derivative function
      this.derivative = math.derivative(f, 'x').compile();
      this.x0 = x0;
      this.tolerance = tolerance;
      this.maxIterations = maxIterations;
    } catch (error) {
      console.error('Error initializing NewtonRaphson:', error);
    }
  }

  f(x) {
    return this.compiled.evaluate({ x: Number(x) });
  }

  fPrime(x) {
    return this.derivative.evaluate({ x: Number(x) });
  }

  calculate() {
    let x0 = this.x0;
    let x1;
    let errorPercent = null;
    let iteration = 0;
    const history = [];

    do {
      x1 = x0 - this.f(x0) / this.fPrime(x0);

      if (x1 === undefined || isNaN(x1) || !isFinite(x1)) {
        return {
          error: true,
          message: 'Calculation error: Division by zero or invalid value encountered.'
        };
      }

      if (iteration > 0) {
        errorPercent = Math.abs((x1 - x0) / x1) * 100;
      }
      history.push({ 
        iteration,
        xCurrent: x0,
        fxCurrent: this.f(x0),
        slope: this.fPrime(x0),
        nextX: x1,
        fxNext: this.f(x1),
        errorPercent
       });

      x0 = x1;
      iteration++;
    } while (
      (errorPercent === null || errorPercent > this.tolerance) &&
      iteration < this.maxIterations
    );

    return { x1, iteration, fx1: this.f(x1), history };
  }
}

// Example usage
// let test = new NewtonRaphson(1, 'x ^ 2 - 7', 1e-6);
// console.log(test.calculate());