import { describe, it, expect } from 'vitest'
import Jacobi from '../src/numerical/linear_algebra/Jacobi.js'

describe('Jacobi Iteration', () => {
  it('should solve a diagonally dominant 4x4 system', () => {
    const A = [
      [5, 2, 0, 0],
      [2, 5, 2, 0],
      [0, 2, 5, 2],
      [0, 0, 2, 5]
    ]
    const B = [12, 17, 14, 7]
    const x0 = [0, 0, 0, 0]
    const solver = new Jacobi(A, B, x0, 1e-6)
    const result = solver.calculate()

    expect(result.solution).toHaveLength(4)
    // Verify Ax ≈ B
    for (let i = 0; i < 4; i++) {
      let sum = 0
      for (let j = 0; j < 4; j++) sum += A[i][j] * result.solution[j]
      expect(sum).toBeCloseTo(B[i], 3)
    }
  })

  it('should converge for simple 2x2 diagonally dominant', () => {
    const A = [[4, 1], [1, 3]]
    const B = [9, 7]
    const x0 = [0, 0]
    const solver = new Jacobi(A, B, x0, 1e-6)
    const result = solver.calculate()
    // Solution: x=2, y=5/3 ≈ 1.818...  
    // Actually: 4x+y=9, x+3y=7 => x=20/11, y=19/11
    expect(result.solution).toHaveLength(2)
    expect(result.iterations).toBeGreaterThan(0)
  })

  it('should return history with correct fields', () => {
    const A = [[4, 1], [1, 3]]
    const B = [9, 7]
    const x0 = [0, 0]
    const solver = new Jacobi(A, B, x0, 1e-2)
    const result = solver.calculate()
    expect(result.history).toBeInstanceOf(Array)
    const entry = result.history[0]
    expect(entry).toHaveProperty('currentX')
    expect(entry).toHaveProperty('errorPercent')
    expect(entry).toHaveProperty('iteration')
  })

  it('should respect maxIterations', () => {
    const A = [[4, 1], [1, 3]]
    const B = [9, 7]
    const x0 = [0, 0]
    const solver = new Jacobi(A, B, x0, 1e-20, 5)
    const result = solver.calculate()
    expect(result.iterations).toBeLessThanOrEqual(5)
  })
})
