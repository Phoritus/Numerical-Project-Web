import { describe, it, expect } from 'vitest'
import Secant from '../src/numerical/root_of_equation/Secant.js'

describe('Secant Method', () => {
  it('should find root of x^2 - 7 with x0=1, x1=2', () => {
    const solver = new Secant(1, 2, 'x^2 - 7', 1e-6)
    const result = solver.calculate()
    expect(result.root).toBeCloseTo(Math.sqrt(7), 4)
    expect(result.iterations).toBeGreaterThan(0)
  })

  it('should find root of x^3 - x - 2 with x0=1, x1=2', () => {
    const solver = new Secant(1, 2, 'x^3 - x - 2', 1e-6)
    const result = solver.calculate()
    expect(result.root).toBeCloseTo(1.52138, 3)
  })

  it('should return history with correct fields', () => {
    const solver = new Secant(1, 2, 'x^2 - 7', 1e-2)
    const result = solver.calculate()
    expect(result.history).toBeInstanceOf(Array)
    const entry = result.history[0]
    expect(entry).toHaveProperty('iteration')
    expect(entry).toHaveProperty('x0')
    expect(entry).toHaveProperty('x1')
    expect(entry).toHaveProperty('fx0')
    expect(entry).toHaveProperty('fx1')
  })

  it('should have first iteration errorPercent as null', () => {
    const solver = new Secant(1, 2, 'x^2 - 7', 1e-2)
    const result = solver.calculate()
    expect(result.history[0].errorPercent).toBeNull()
  })

  it('should throw on invalid equation', () => {
    expect(() => new Secant(1, 2, '???broken')).toThrow()
  })

  it('should respect maxIterations', () => {
    const solver = new Secant(1, 2, 'x^2 - 7', 1e-20, 5)
    const result = solver.calculate()
    expect(result.iterations).toBeLessThanOrEqual(5)
  })
})
