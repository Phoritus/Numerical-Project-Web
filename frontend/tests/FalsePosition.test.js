import { describe, it, expect } from 'vitest'
import FalsePosition from '../src/numerical/root_of_equation/FalsePosition.js'

describe('False Position Method', () => {
  it('should find root of x^2 - 4 in [0, 5]', () => {
    const solver = new FalsePosition(0, 5, 'x^2 - 4', 1e-6)
    const result = solver.calculate()
    expect(result.xm).toBeCloseTo(2, 4)
    expect(result.iteration).toBeGreaterThan(0)
  })

  it('should find root of x^3 - x - 2 in [1, 2]', () => {
    const solver = new FalsePosition(1, 2, 'x^3 - x - 2', 1e-6)
    const result = solver.calculate()
    expect(result.xm).toBeCloseTo(1.52138, 4)
  })

  it('should find root of x^2 - 7 in [1, 5]', () => {
    const solver = new FalsePosition(1, 5, 'x^2 - 7', 1e-6)
    const result = solver.calculate()
    expect(result.xm).toBeCloseTo(Math.sqrt(7), 2)
  })

  it('should return history array', () => {
    const solver = new FalsePosition(0, 5, 'x^2 - 4', 1e-4)
    const result = solver.calculate()
    expect(result.history).toBeInstanceOf(Array)
    expect(result.history.length).toBeGreaterThan(0)
  })

  it('should have correct history entry fields', () => {
    const solver = new FalsePosition(0, 5, 'x^2 - 4', 1e-2)
    const result = solver.calculate()
    const entry = result.history[0]
    expect(entry).toHaveProperty('iteration')
    expect(entry).toHaveProperty('xm')
    expect(entry).toHaveProperty('fxm')
    expect(entry).toHaveProperty('relativeError')
  })

  it('should respect maxIterations', () => {
    const solver = new FalsePosition(0, 5, 'x^2 - 4', 1e-20, 5)
    const result = solver.calculate()
    expect(result.iteration).toBeLessThanOrEqual(5)
  })
})
