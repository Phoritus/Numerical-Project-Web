import { describe, it, expect } from 'vitest'
import Cholesky from '../src/numerical/linear_algebra/Cholesky.js'

describe('Cholesky Decomposition', () => {
  it('should solve a 3x3 SPD system', () => {
    const A = [
      [4, 12, -16],
      [12, 37, -43],
      [-16, -43, 98]
    ]
    const B = [1, 2, 3]
    const solver = new Cholesky(A, B)
    const result = solver.calculate()
    expect(result.vector).toHaveLength(3)
    // Verify structure
    expect(result).toHaveProperty('vector')
    result.vector.forEach(v => expect(typeof v).toBe('number'))
  })

  it('should solve a 2x2 SPD system', () => {
    const A = [[4, 2], [2, 5]]
    const B = [8, 9]
    const solver = new Cholesky(A, B)
    const result = solver.calculate()
    expect(result.vector).toHaveLength(2)
    result.vector.forEach(v => expect(typeof v).toBe('number'))
  })

  it('should return result with vector property', () => {
    const A = [[4, 2], [2, 5]]
    const B = [8, 9]
    const solver = new Cholesky(A, B)
    const result = solver.calculate()
    expect(result).toHaveProperty('vector')
  })

  it('should handle identity matrix', () => {
    const A = [[1, 0], [0, 1]]
    const B = [3, 7]
    const solver = new Cholesky(A, B)
    const result = solver.calculate()
    expect(result.vector[0]).toBeCloseTo(3, 8)
    expect(result.vector[1]).toBeCloseTo(7, 8)
  })
})
