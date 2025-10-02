import { create, all} from 'mathjs';
const math = create(all, { implicit: 'show' });

export default class NewtonRaphson {

  constructor(x0, f, tolerance = 1e-6, maxIterations = 1000) {
    try {
      this.expression = f;
      this.node = math.parse(f);
      this.compiled = this.node.compile();
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
    return this.node.derivative('x').compile().evaluate({ x: Number(x) });
  }
}