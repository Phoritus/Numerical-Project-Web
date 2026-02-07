import { describe, it, expect } from 'vitest'
import Graphical from '../src/numerical/root_of_equation/Graphical.js'

describe('Graphical Method', () => {
  it('should find root of x^2 - 4 in [1, 3]', () => {
    const solver = new Graphical(1, 3, 1e-4, 'x^2 - 4')
    const result = solver.calculate()
    expect(result.root).toBeCloseTo(2, 1)
    expect(result.iterations).toBeGreaterThan(0)
  })

  it('should find root of x^3 - x - 2 in [1, 3]', () => {
    const solver = new Graphical(1, 3, 1e-4, 'x^3 - x - 2')
    const result = solver.calculate()
    expect(result.root).toBeCloseTo(1.52138, 2)
  })

  it('should return history with correct fields', () => {
    const solver = new Graphical(0, 5, 1e-2, 'x^2 - 4')
    const result = solver.calculate()
    expect(result.history).toBeInstanceOf(Array)
    expect(result.history.length).toBeGreaterThan(0)
    const entry = result.history[0]
    expect(entry).toHaveProperty('iterations')
    expect(entry).toHaveProperty('x')
    expect(entry).toHaveProperty('fx')
    expect(entry).toHaveProperty('errorPercent')
  })

  it('should return result with root and fxm', () => {
    const solver = new Graphical(0, 5, 1e-2, 'x^2 - 4')
    const result = solver.calculate()
    expect(result).toHaveProperty('root')
    expect(result).toHaveProperty('fxm')
    expect(result).toHaveProperty('iterations')
    expect(result).toHaveProperty('history')
  })
})
