import { create, all } from 'mathjs';
const math = create(all, { implicit: 'show' });

export default class FalsePosition {
  
  constructor(f, xl, xr, tolerance = 1e-6, maxIterations = 1000) {
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
    
  }
}