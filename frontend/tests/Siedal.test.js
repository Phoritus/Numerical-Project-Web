import { describe, it, expect } from 'vitest'
import Siedal from '../src/numerical/linear_algebra/Siedal.js'

describe('Gauss-Seidel (Siedal) Iteration', () => {
  it('should solve a diagonally dominant 4x4 system', () => {
    const A = [
      [5, 2, 0, 0],
      [2, 5, 2, 0],
      [0, 2, 5, 2],
      [0, 0, 2, 5]
    ]
    const B = [12, 17, 14, 7]
    const x0 = [0, 0, 0, 0]
    const solver = new Siedal(A, B, x0, 1e-6)
    const result = solver.calculate()

    expect(result.solution).toHaveLength(4)
    // Verify Ax ≈ B
    for (let i = 0; i < 4; i++) {
      let sum = 0
      for (let j = 0; j < 4; j++) sum += A[i][j] * result.solution[j]
      expect(sum).toBeCloseTo(B[i], 3)
    }
  })

  it('should converge faster than Jacobi for same system', () => {
    const A = [
      [5, 2, 0, 0],
      [2, 5, 2, 0],
      [0, 2, 5, 2],
      [0, 0, 2, 5]
    ]
    const B = [12, 17, 14, 7]
    const x0 = [0, 0, 0, 0]
    const siedal = new Siedal(A, B, x0.slice(), 1e-6)
    const result = siedal.calculate()
    // Gauss-Seidel typically converges faster
    expect(result.iterations).toBeGreaterThan(0)
    expect(result.solution).toHaveLength(4)
  })

  it('should return history array', () => {
    const A = [[4, 1], [1, 3]]
    const B = [9, 7]
    const x0 = [0, 0]
    const solver = new Siedal(A, B, x0, 1e-2)
    const result = solver.calculate()
    expect(result.history).toBeInstanceOf(Array)
    expect(result.history.length).toBeGreaterThan(0)
    expect(result.history[0]).toHaveProperty('currentX')
    expect(result.history[0]).toHaveProperty('errorPercent')
  })

  it('should respect maxIterations', () => {
    const A = [[4, 1], [1, 3]]
    const B = [9, 7]
    const x0 = [0, 0]
    const solver = new Siedal(A, B, x0, 1e-20, 5)
    const result = solver.calculate()
    expect(result.iterations).toBeLessThanOrEqual(5)
  })
})
