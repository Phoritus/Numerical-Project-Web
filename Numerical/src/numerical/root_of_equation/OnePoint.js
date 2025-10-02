import { create, all, re } from "mathjs";
const math = create(all, { implicit: "show" });

export default class OnePoint {
  constructor(x0, f, tolerance = 1e-6, maxIterations = 1000) {
    try {
      this.expression = f;
      this.node = math.parse(f);
      this.compiled = this.node.compile();
      this.x0 = x0;
      this.tolerance = tolerance;
      this.maxIterations = maxIterations;
    } catch (error) {
      console.error("Error initializing OnePoint:", error);
    }
  }

  f(x) {
    return this.compiled.evaluate({ x: Number(x) });
  }

  calculate() {
    let x0 = this.x0, x1;
    let iteration = 0;
    const history = [];
    let errorPercent = null;

    do {
      x1 = this.f(x0);

      if (!isFinite(x1)) {
        return { error: true, message: "Divergent or no root found." };
      }

      if (iteration > 0) {
        errorPercent = Math.abs((x1 - x0) / x1) * 100;
      }

      history.push({ iteration, x1, fx1: this.f(x1), errorPercent });

      x0 = x1;
      iteration++;
    } while ((errorPercent === null || errorPercent > this.tolerance) 
             && iteration < this.maxIterations);

    return { history, x1, error: errorPercent, iteration };
  }
}

// // Example
// let op = new OnePoint(0, "(7+x)/(x+1)");
// let result = op.calculate();
// console.log(result.x1);
