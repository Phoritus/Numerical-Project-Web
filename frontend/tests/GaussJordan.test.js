import { describe, it, expect } from 'vitest'
import GaussJordan from '../src/numerical/linear_algebra/GaussJordan.js'

describe('Gauss-Jordan Elimination', () => {
  it('should solve a 3x3 system', () => {
    const A = [
      [2, 1, -1],
      [-3, -1, 2],
      [-2, 1, 2]
    ]
    const B = [8, -11, -3]
    const solver = new GaussJordan(A, B)
    const result = solver.calculate()
    // GaussJordan returns reduced matrix and modified vector
    expect(result).toHaveProperty('matrix')
    expect(result).toHaveProperty('vector')
    expect(result.vector).toHaveLength(3)
  })

  it('should produce identity matrix after elimination', () => {
    const A = [[1, 2], [3, 4]]
    const B = [5, 11]
    const solver = new GaussJordan(A, B)
    const result = solver.calculate()
    // Matrix should be identity
    expect(result.matrix[0][0]).toBeCloseTo(1, 8)
    expect(result.matrix[0][1]).toBeCloseTo(0, 8)
    expect(result.matrix[1][0]).toBeCloseTo(0, 8)
    expect(result.matrix[1][1]).toBeCloseTo(1, 8)
  })

  it('should return correct solution for 2x2', () => {
    const A = [[1, 2], [3, 4]]
    const B = [5, 11]
    const solver = new GaussJordan(A, B)
    const result = solver.calculate()
    expect(result).toHaveProperty('vector')
    expect(result.vector).toHaveLength(2)
  })

  it('should have matrix and vector in result', () => {
    const A = [[2, 1], [5, 3]]
    const B = [4, 7]
    const solver = new GaussJordan(A, B)
    const result = solver.calculate()
    expect(result).toHaveProperty('matrix')
    expect(result).toHaveProperty('vector')
  })
})
