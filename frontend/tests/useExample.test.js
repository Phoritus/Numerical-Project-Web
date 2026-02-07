import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useExample } from '../src/hooks/useExample.js'

describe('useExample hook', () => {
  let mockSetErrorMsg
  let mockSetXl
  let mockSetXr
  let mockSetTolerance
  let mockSetEquation

  beforeEach(() => {
    mockSetErrorMsg = vi.fn()
    mockSetXl = vi.fn()
    mockSetXr = vi.fn()
    mockSetTolerance = vi.fn()
    mockSetEquation = vi.fn()
  })

  it('should return handleExample and loading', () => {
    const mockApi = vi.fn().mockResolvedValue({ success: true, data: [] })
    const { result } = renderHook(() =>
      useExample(mockApi, {
        setErrorMsg: mockSetErrorMsg,
        fields: { xl: mockSetXl }
      })
    )
    expect(result.current).toHaveProperty('handleExample')
    expect(result.current).toHaveProperty('loading')
    expect(typeof result.current.handleExample).toBe('function')
    expect(result.current.loading).toBe(false)
  })

  it('should set loading to true when handleExample is called', async () => {
    let resolvePromise
    const mockApi = vi.fn().mockReturnValue(new Promise(r => { resolvePromise = r }))

    const { result } = renderHook(() =>
      useExample(mockApi, {
        setErrorMsg: mockSetErrorMsg,
        fields: { xl: mockSetXl }
      })
    )

    act(() => {
      result.current.handleExample()
    })

    expect(result.current.loading).toBe(true)

    // Resolve to clean up
    await act(async () => {
      resolvePromise({ success: true, data: [] })
    })
  })

  it('should call API function with random id between 1-5', async () => {
    const mockApi = vi.fn().mockResolvedValue({ success: true, data: [] })

    const { result } = renderHook(() =>
      useExample(mockApi, {
        setErrorMsg: mockSetErrorMsg,
        fields: { xl: mockSetXl }
      })
    )

    await act(async () => {
      result.current.handleExample()
    })

    expect(mockApi).toHaveBeenCalledTimes(1)
    const calledWith = mockApi.mock.calls[0][0]
    expect(calledWith).toBeGreaterThanOrEqual(1)
    expect(calledWith).toBeLessThanOrEqual(5)
  })

  it('should populate fields on successful response', async () => {
    vi.useFakeTimers()
    const mockData = {
      xl: 0, xr: 10, tolerance: 0.001, equation: 'x^2 - 4'
    }
    const mockApi = vi.fn().mockResolvedValue({
      success: true,
      data: [mockData]
    })

    const { result } = renderHook(() =>
      useExample(mockApi, {
        setErrorMsg: mockSetErrorMsg,
        fields: {
          xl: mockSetXl,
          xr: mockSetXr,
          tolerance: mockSetTolerance,
          equation: mockSetEquation
        }
      })
    )

    await act(async () => {
      result.current.handleExample()
    })

    expect(mockSetXl).toHaveBeenCalledWith(0)
    expect(mockSetXr).toHaveBeenCalledWith(10)
    expect(mockSetTolerance).toHaveBeenCalledWith(0.001)
    expect(mockSetEquation).toHaveBeenCalledWith('x^2 - 4')
    expect(mockSetErrorMsg).toHaveBeenCalledWith(null)

    vi.useRealTimers()
  })

  it('should set error message when no example found', async () => {
    vi.useFakeTimers()
    const mockApi = vi.fn().mockResolvedValue({ success: true, data: [] })

    const { result } = renderHook(() =>
      useExample(mockApi, {
        setErrorMsg: mockSetErrorMsg,
        fields: { xl: mockSetXl }
      })
    )

    await act(async () => {
      result.current.handleExample()
    })

    expect(mockSetErrorMsg).toHaveBeenCalledWith('No example found')
    vi.useRealTimers()
  })

  it('should set error message on API failure', async () => {
    vi.useFakeTimers()
    const mockApi = vi.fn().mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() =>
      useExample(mockApi, {
        setErrorMsg: mockSetErrorMsg,
        fields: { xl: mockSetXl }
      })
    )

    await act(async () => {
      result.current.handleExample()
    })

    expect(mockSetErrorMsg).toHaveBeenCalledWith('Error fetching example: Network error')
    vi.useRealTimers()
  })

  it('should prevent rapid clicks (spam guard)', async () => {
    let resolvePromise
    const mockApi = vi.fn().mockReturnValue(new Promise(r => { resolvePromise = r }))

    const { result } = renderHook(() =>
      useExample(mockApi, {
        setErrorMsg: mockSetErrorMsg,
        fields: { xl: mockSetXl }
      })
    )

    act(() => {
      result.current.handleExample()
    })

    // Second call while loading - should be ignored
    act(() => {
      result.current.handleExample()
    })

    expect(mockApi).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolvePromise({ success: true, data: [] })
    })
  })
})
