import { describe, it, expect } from 'vitest'
import GaussElimination from '../src/numerical/linear_algebra/GaussElimination.js'

describe('Gauss Elimination', () => {
  it('should solve a 3x3 system', () => {
    const A = [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2]
    ]
    const B = [8, -11, -3]
    const solver = new GaussElimination(A, B)
    const result = solver.calculate()
    // Known solution: x=2, y=3, z=-1
    expect(result.solution[0]).toBeCloseTo(2, 8)
    expect(result.solution[1]).toBeCloseTo(3, 8)
    expect(result.solution[2]).toBeCloseTo(-1, 8)
  })

  it('should solve a 2x2 system', () => {
    const A = [[1, 2], [3, 4]]
    const B = [5, 11]
    const solver = new GaussElimination(A, B)
    const result = solver.calculate()
    expect(result.solution[0]).toBeCloseTo(1, 8)
    expect(result.solution[1]).toBeCloseTo(2, 8)
  })

  it('should return solution array', () => {
    const A = [[4, 3], [6, 3]]
    const B = [10, 12]
    const solver = new GaussElimination(A, B)
    const result = solver.calculate()
    expect(result).toHaveProperty('solution')
    expect(result.solution).toHaveLength(2)
  })

  it('should handle 4x4 system', () => {
    const A = [
      [5, 2, 0, 0],
      [2, 5, 2, 0],
      [0, 2, 5, 2],
      [0, 0, 2, 5]
    ]
    const B = [12, 17, 14, 7]
    const solver = new GaussElimination(A, B)
    const result = solver.calculate()
    expect(result.solution).toHaveLength(4)
    // Verify Ax = B
    for (let i = 0; i < 4; i++) {
      let sum = 0
      for (let j = 0; j < 4; j++) sum += A[i][j] * result.solution[j]
      expect(sum).toBeCloseTo(B[i], 6)
    }
  })
})
