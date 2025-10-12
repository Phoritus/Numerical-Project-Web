import {create, all} from 'mathjs'
const math = create(all, { implicit: 'show' });

export default class Secant {
  constructor(x0, x1, f, tolerance = 1e-6, maxIterations = 1000) {
    try {
      this.expression = f;
      this.node = math.parse(f);
      this.compiled = this.node.compile();
      this.x0 = x0;
      this.x1 = x1;
      this.tolerance = tolerance;
      this.maxIterations = maxIterations;
    } catch (err) {
      throw new Error('Invalid function expression: ' + err.message);
    }

  }

  f(x) {
    return this.compiled.evaluate({ x: Number(x) });
  }

  calculate() {
    let x0 = this.x0, x1 = this.x1;
    let xi, errorPercent = null, iteration = 0;
    const history = [];
    
    do {
      let fx0 = this.f(x0);
      let fx1 = this.f(x1);

      history.push({
        iteration,
        x0,
        x1,
        fx0,
        fx1,
        errorPercent
      });

      if (fx1 - fx0 === 0) {
        throw new Error('Division by zero encountered in Secant method.');
      }
      xi = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0);

      // Update for next iteration
      errorPercent = iteration > 0 ? Math.abs((xi - x0) / xi) : null;
      x0 = x1;
      x1 = xi;

      iteration++;

    } while ((errorPercent === null || errorPercent > this.tolerance) && iteration < this.maxIterations);

    return {
      root: x0,
      iterations: iteration,
      history: history
    };
  }
}

// let test = new Secant(1, 2, "x^2 - 7", 0.000001);
// console.log(test.calculate());