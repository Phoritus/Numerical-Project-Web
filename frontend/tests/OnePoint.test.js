import { describe, it, expect } from 'vitest'
import OnePoint from '../src/numerical/root_of_equation/OnePoint.js'

describe('One Point Iteration Method', () => {
  it('should find root of g(x) = (7+x)/(x+1)', () => {
    // Fixed point: x = (7+x)/(x+1) => x^2 + x = 7 + x => x^2 = 7 => x ≈ 2.6458
    const solver = new OnePoint(0, '(7+x)/(x+1)', 1e-6)
    const result = solver.calculate()
    expect(result.x1).toBeCloseTo(Math.sqrt(7), 4)
    expect(result.error).not.toBe(true) // error field is the error percentage, not boolean
    expect(result.iteration).toBeGreaterThan(0)
  })

  it('should return history with correct fields', () => {
    const solver = new OnePoint(0, '(7+x)/(x+1)', 1e-2)
    const result = solver.calculate()
    expect(result.history).toBeInstanceOf(Array)
    const entry = result.history[0]
    expect(entry).toHaveProperty('iteration')
    expect(entry).toHaveProperty('x1')
    expect(entry).toHaveProperty('fx1')
  })

  it('should return error for divergent function', () => {
    const solver = new OnePoint(100, 'x^2 + x + 1', 1e-6, 50)
    const result = solver.calculate()
    // Should either hit max iterations or return divergent error
    expect(result.error === true || result.iteration >= 50).toBeTruthy()
  })

  it('should have first iteration errorPercent as null', () => {
    const solver = new OnePoint(0, '(7+x)/(x+1)', 1e-2)
    const result = solver.calculate()
    expect(result.history[0].errorPercent).toBeNull()
  })

  it('should respect maxIterations', () => {
    const solver = new OnePoint(0, '(7+x)/(x+1)', 1e-20, 10)
    const result = solver.calculate()
    expect(result.iteration).toBeLessThanOrEqual(10)
  })
})
