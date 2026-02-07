import { describe, it, expect } from 'vitest'
import BisectionJS from '../src/numerical/root_of_equation/Bisection.js'

describe('Bisection Method', () => {
  it('should find root of 43x - 180 in [0, 10]', () => {
    const solver = new BisectionJS('43*x - 180', 0, 10, 1e-6)
    const result = solver.calculate()
    expect(result.root).toBeCloseTo(180 / 43, 5)
    expect(result.iterations).toBeGreaterThan(0)
    expect(result.history).toBeInstanceOf(Array)
    expect(result.history.length).toBe(result.iterations)
  })

  it('should find root of x^2 - 4 in [0, 5]', () => {
    const solver = new BisectionJS('x^2 - 4', 0, 5, 1e-6)
    const result = solver.calculate()
    expect(result.root).toBeCloseTo(2, 5)
  })

  it('should find root of x^3 - x - 2 in [1, 2]', () => {
    const solver = new BisectionJS('x^3 - x - 2', 1, 2, 1e-6)
    const result = solver.calculate()
    expect(result.root).toBeCloseTo(1.52138, 4)
  })

  it('should return history with correct fields', () => {
    const solver = new BisectionJS('x^2 - 4', 0, 5, 1e-2)
    const result = solver.calculate()
    const entry = result.history[1]
    expect(entry).toHaveProperty('iteration')
    expect(entry).toHaveProperty('xm')
    expect(entry).toHaveProperty('fxm')
    expect(entry).toHaveProperty('errorPercent')
  })

  it('should have first iteration with null errorPercent', () => {
    const solver = new BisectionJS('x^2 - 4', 0, 5, 1e-2)
    const result = solver.calculate()
    expect(result.history[0].errorPercent).toBeNull()
  })

  it('should respect maxIterations limit', () => {
    const solver = new BisectionJS('x^2 - 4', 0, 5, 1e-20, 10)
    const result = solver.calculate()
    expect(result.iterations).toBeLessThanOrEqual(10)
  })

  it('should throw on invalid equation', () => {
    expect(() => new BisectionJS('???invalid', 0, 10)).toThrow()
  })
})
