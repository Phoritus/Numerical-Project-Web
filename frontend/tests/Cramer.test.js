import { describe, it, expect } from 'vitest'
import Cramer from '../src/numerical/linear_algebra/Cramer.js'

describe('Cramer\'s Rule', () => {
  it('should solve a 3x3 system', () => {
    const A = [
      [-2, 3, 1],
      [3, 4, -5],
      [1, -2, 1]
    ]
    const B = [9, 0, -4]
    const solver = new Cramer(A, B)
    const result = solver.calculate()

    expect(result.solutions).toHaveLength(3)
    expect(result.detA).not.toBe(0)
    expect(result.steps).toHaveLength(3)

    // Verify Ax = B
    for (let i = 0; i < 3; i++) {
      let sum = 0
      for (let j = 0; j < 3; j++) {
        sum += A[i][j] * result.solutions[j]
      }
      expect(sum).toBeCloseTo(B[i], 8)
    }
  })

  it('should solve a 2x2 system', () => {
    const A = [[2, 1], [5, 3]]
    const B = [4, 7]
    const solver = new Cramer(A, B)
    const result = solver.calculate()
    // 2x + y = 4, 5x + 3y = 7 => x=5, y=-6
    expect(result.solutions[0]).toBeCloseTo(5, 8)
    expect(result.solutions[1]).toBeCloseTo(-6, 8)
  })

  it('should throw for singular matrix (det = 0)', () => {
    const A = [[1, 2], [2, 4]]
    const B = [3, 6]
    const solver = new Cramer(A, B)
    expect(() => solver.calculate()).toThrow()
  })

  it('should return steps with correct fields', () => {
    const A = [[2, 1], [5, 3]]
    const B = [4, 7]
    const solver = new Cramer(A, B)
    const result = solver.calculate()
    const step = result.steps[0]
    expect(step).toHaveProperty('index')
    expect(step).toHaveProperty('matrixAi')
    expect(step).toHaveProperty('detAi')
    expect(step).toHaveProperty('detA')
    expect(step).toHaveProperty('xi')
  })
})
