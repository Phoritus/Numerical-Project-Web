import { describe, it, expect } from 'vitest'
import ConjugateGradient from '../src/numerical/linear_algebra/Conjugate.js'

describe('Conjugate Gradient Method', () => {
  it('should solve a symmetric positive definite 4x4 system', () => {
    const A = [
      [5, 2, 0, 0],
      [2, 5, 2, 0],
      [0, 2, 5, 2],
      [0, 0, 2, 5]
    ]
    const B = [12, 17, 14, 7]
    const x0 = [0, 0, 0, 0]
    const solver = new ConjugateGradient(A, B, x0, 1e-6)
    const result = solver.calculate()

    expect(result.solution).toHaveLength(4)
    // Verify Ax ≈ B
    for (let i = 0; i < 4; i++) {
      let sum = 0
      for (let j = 0; j < 4; j++) sum += A[i][j] * result.solution[j]
      expect(sum).toBeCloseTo(B[i], 3)
    }
  })

  it('should solve a 2x2 SPD system', () => {
    const A = [[4, 1], [1, 3]]
    const B = [1, 2]
    const x0 = [0, 0]
    const solver = new ConjugateGradient(A, B, x0, 1e-8)
    const result = solver.calculate()
    // 4x + y = 1, x + 3y = 2 => x=1/11, y=7/11
    expect(result.solution[0]).toBeCloseTo(1 / 11, 5)
    expect(result.solution[1]).toBeCloseTo(7 / 11, 5)
  })

  it('should return history with correct fields', () => {
    const A = [[4, 1], [1, 3]]
    const B = [1, 2]
    const x0 = [0, 0]
    const solver = new ConjugateGradient(A, B, x0, 1e-4)
    const result = solver.calculate()
    expect(result.history).toBeInstanceOf(Array)
    const entry = result.history[0]
    expect(entry).toHaveProperty('currentX')
    expect(entry).toHaveProperty('residual')
    expect(entry).toHaveProperty('alpha')
    expect(entry).toHaveProperty('error')
    expect(entry).toHaveProperty('iteration')
  })

  it('should have error property in result', () => {
    const A = [[4, 1], [1, 3]]
    const B = [1, 2]
    const x0 = [0, 0]
    const solver = new ConjugateGradient(A, B, x0, 1e-6)
    const result = solver.calculate()
    expect(result).toHaveProperty('error')
    expect(result).toHaveProperty('iterations')
    expect(result.error).toBeLessThan(1e-5)
  })

  it('should respect maxIterations', () => {
    const A = [[4, 1], [1, 3]]
    const B = [1, 2]
    const x0 = [0, 0]
    const solver = new ConjugateGradient(A, B, x0, 1e-20, 3)
    const result = solver.calculate()
    expect(result.iterations).toBeLessThanOrEqual(3)
  })
})
