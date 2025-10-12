import { create, all } from 'mathjs';
const math = create(all, { implicit: 'show' });

export default class FalsePosition {

  constructor(xl, xr, f, tolerance = 1e-6, maxIterations = 1000) {
    try {
      this.expression = f;
      this.node = math.parse(f);
      this.compiled = this.node.compile();
    } catch (error) {
      console.error('Error initializing FalsePosition:', error);
    }

    this.xl = xl;
    this.xr = xr;
    this.tolerance = tolerance;
    this.maxIterations = maxIterations;
  }

  f(x) {
    return this.compiled.evaluate({ x });
  }

  calculate() {
    let xl = this.xl, relativeError = Infinity;
    let xr = this.xr, prevXm = null;
    let xm, fxm;
    let iteration = 0;
    const history = [];

    do {
      xm = (xl * this.f(xr) - xr * this.f(xl)) / (this.f(xr) - this.f(xl));
      fxm = this.f(xm);

      if (prevXm !== null && xm !== 0) {
        relativeError = Math.abs((xm - prevXm) / xm) * 100;
      }

      history.push({ iteration, xm, fxm, relativeError });

      if (Math.abs(fxm) < this.tolerance) break;

      if (fxm * this.f(xl) < 0) xr = xm;
      else xl = xm;

      prevXm = xm;
      iteration++;

    } while (relativeError > this.tolerance && iteration < this.maxIterations);

    return { 
      xm, fxm, iteration, history
    };
  }
}

// let fp = new FalsePosition(0, 20, 'x ^ 12 - 1265256', 0.000001);
// let result = fp.calculate();
// console.log(result.xm, result.fxm, result.iteration, result.history);