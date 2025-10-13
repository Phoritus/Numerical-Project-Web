import { create, all } from 'mathjs';
const math = create(all, {
    implicit: 'show'
});

export default class BisectionJS {

  constructor(f, xl, xr, tolerance = 1e-6, maxIterations = 1000) {
    try {
      this.expression = f;
      this.node = math.parse(f);
      this.compiled = this.node.compile();
    } catch (err) {
      throw new Error('Invalid function expression: ' + err.message);
    }

    this.xl = xl;
    this.xr = xr;
    this.tolerance = tolerance;
    this.maxIterations = maxIterations;
  }

  evaluate(x) {
    return this.compiled.evaluate({ x });
  }

  calculate() {
    let xl = this.xl;
    let xr = this.xr;
    let xm;
    let iteration = 0;
    const history = [];

    let fxl = this.evaluate(xl);
    let fxr = this.evaluate(xr);
    let prevXm = null;

    do {
      xm = (xl + xr) / 2;
      const fxm = this.evaluate(xm);
      let errorPercent = null;
      if (prevXm !== null && xm !== 0) {
        errorPercent = Math.abs((xm - prevXm) / xm) * 100;
      }
      history.push({ iteration, xm, fxm, errorPercent });

      if (fxl * fxm < 0) {
        xr = xm;
        fxr = fxm;
      } else {
        xl = xm;
        fxl = fxm;
      }

      prevXm = xm;
      iteration++;
      if (iteration >= this.maxIterations) {
        break;
      }
    } while (Math.abs(xr - xl) >= this.tolerance);

    return {
      root: xm,
      iterations: iteration,
      fxm: this.evaluate(xm),
      history,
      tolerance: this.tolerance,
    };
  }

}

// Example usage (commented out for production)
// const test = new BisectionJS('43*x - 180', 0, 10, 1e-6);
// console.log(test.calculate());
