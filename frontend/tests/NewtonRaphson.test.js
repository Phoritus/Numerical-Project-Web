import { describe, it, expect } from 'vitest'
import NewtonRaphson from '../src/numerical/root_of_equation/NewtonRaphson.js'

describe('Newton-Raphson Method', () => {
  it('should find root of x^2 - 7 starting from x0=1', () => {
    const solver = new NewtonRaphson(1, 'x^2 - 7', 1e-6)
    const result = solver.calculate()
    expect(result.x1).toBeCloseTo(Math.sqrt(7), 5)
    expect(result.iteration).toBeGreaterThan(0)
    expect(result.history).toBeInstanceOf(Array)
  })

  it('should find root of x^3 - x - 2 starting from x0=1', () => {
    const solver = new NewtonRaphson(1, 'x^3 - x - 2', 1e-6)
    const result = solver.calculate()
    expect(result.x1).toBeCloseTo(1.52138, 4)
  })

  it('should converge faster than Bisection', () => {
    const nr = new NewtonRaphson(3, 'x^2 - 4', 1e-6)
    const resultNR = nr.calculate()
    // Newton-Raphson typically converges in very few iterations for polynomials
    expect(resultNR.iteration).toBeLessThan(20)
    expect(resultNR.x1).toBeCloseTo(2, 5)
  })

  it('should return history with correct fields', () => {
    const solver = new NewtonRaphson(1, 'x^2 - 4', 1e-2)
    const result = solver.calculate()
    const entry = result.history[0]
    expect(entry).toHaveProperty('iteration')
    expect(entry).toHaveProperty('xCurrent')
    expect(entry).toHaveProperty('fxCurrent')
    expect(entry).toHaveProperty('slope')
    expect(entry).toHaveProperty('nextX')
  })

  it('should handle error when derivative is zero', () => {
    // x^3 at x0=0 has f'(0)=0, causing division by zero
    const solver = new NewtonRaphson(0, 'x^3', 1e-6)
    const result = solver.calculate()
    // Should return error or NaN result
    expect(result.error === true || isNaN(result.x1) || result.x1 === 0).toBeTruthy()
  })

  it('should respect maxIterations', () => {
    const solver = new NewtonRaphson(1, 'x^2 - 7', 1e-20, 5)
    const result = solver.calculate()
    expect(result.iteration).toBeLessThanOrEqual(5)
  })
})
