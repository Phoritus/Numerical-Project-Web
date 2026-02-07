import { describe, it, expect } from 'vitest'
import LUDecomposition from '../src/numerical/linear_algebra/LUDecompostion.js'

describe('LU Decomposition', () => {
  it('should solve a 3x3 system', () => {
    const A = [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2]
    ]
    const B = [8, -11, -3]
    const solver = new LUDecomposition(A, B)
    const result = solver.calculate()
    expect(result.vector[0]).toBeCloseTo(2, 6)
    expect(result.vector[1]).toBeCloseTo(3, 6)
    expect(result.vector[2]).toBeCloseTo(-1, 6)
  })

  it('should solve sample 3x3', () => {
    const A = [
      [4, 3, 1],
      [2, 1, 3],
      [6, 5, 4]
    ]
    const B = [1, 2, 3]
    const solver = new LUDecomposition(A, B)
    const result = solver.calculate()
    expect(result).toHaveProperty('vector')
    expect(result.vector).toHaveLength(3)
    // Verify Ax = B
    for (let i = 0; i < 3; i++) {
      let sum = 0
      for (let j = 0; j < 3; j++) sum += A[i][j] * result.vector[j]
      expect(sum).toBeCloseTo(B[i], 6)
    }
  })

  it('should handle 2x2 system', () => {
    const A = [[4, 3], [6, 3]]
    const B = [10, 12]
    const solver = new LUDecomposition(A, B)
    const result = solver.calculate()
    expect(result.vector).toHaveLength(2)
  })
})
