import { describe, it, expect } from 'vitest'
import MatrixInversion from '../src/numerical/linear_algebra/MatrixInversion.js'

describe('Matrix Inversion', () => {
  it('should solve a 3x3 system', () => {
    const A = [
      [1, 2, 1],
      [2, 1, -1],
      [1, -1, 2]
    ]
    const B = [6, 1, 5]
    const solver = new MatrixInversion(A, B)
    const result = solver.calculate()
    expect(result.x).toHaveLength(3)
    // Verify Ax = B
    for (let i = 0; i < 3; i++) {
      let sum = 0
      for (let j = 0; j < 3; j++) sum += A[i][j] * result.x[j]
      expect(sum).toBeCloseTo(B[i], 6)
    }
  })

  it('should return inverse matrix', () => {
    const A = [[2, 1], [5, 3]]
    const B = [4, 7]
    const solver = new MatrixInversion(A, B)
    const result = solver.calculate()
    expect(result).toHaveProperty('inverseA')
    expect(result.inverseA).toHaveLength(2)
    expect(result.inverseA[0]).toHaveLength(2)
  })

  it('should have identity matrix in result.A after inversion', () => {
    const A = [[2, 1], [5, 3]]
    const B = [4, 7]
    const solver = new MatrixInversion(A, B)
    const result = solver.calculate()
    expect(result.A[0][0]).toBeCloseTo(1, 8)
    expect(result.A[0][1]).toBeCloseTo(0, 8)
    expect(result.A[1][0]).toBeCloseTo(0, 8)
    expect(result.A[1][1]).toBeCloseTo(1, 8)
  })

  it('should solve a 2x2 correctly', () => {
    const A = [[1, 2], [3, 4]]
    const B = [5, 11]
    const solver = new MatrixInversion(A, B)
    const result = solver.calculate()
    expect(result.x[0]).toBeCloseTo(1, 8)
    expect(result.x[1]).toBeCloseTo(2, 8)
  })
})
