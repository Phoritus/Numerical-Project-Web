import React, { useRef, useState } from 'react'
import NavbarMain from '../../components/Navbar'
import { InputNumber, Input } from 'antd'


const Bisection = () => {
  const [xl, setXl] = useState(null)
  const [xr, setXr] = useState(null)
  const [tolerance, setTolerance] = useState(null)
  const [equation, setEquation] = useState('')
  const lastParamsRef = useRef(null)

  const handleCalculate = () => {
    // Just capture current values into a variable (no input changes)
    const params = {
      xl: xl == null ? null : Number(xl),
      xr: xr == null ? null : Number(xr),
      tolerance: tolerance == null ? null : Number(tolerance),
      equation: equation.trim(), // keep raw string for parser
    }

    lastParamsRef.current = params
    console.log('Bisection params:', params)
    // TODO: call your solver with params and keep inputs untouched
  }

  return (
    <div className='text-white'>
      <NavbarMain />
      <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-8 text-center'><span className='text-gradient'>Bisection</span> Method</h1>

          <div className='mx-auto max-w-4xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>X Start (xL)</label>
                <InputNumber
                  rootClassName='tw-input-number'
                  style={{ width: '100%' }}
                  placeholder='e.g. 0'
                  value={xl}
                  onChange={setXl}
                  changeOnWheel
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>X End (xR)</label>
                <InputNumber
                  rootClassName='tw-input-number'
                  style={{ width: '100%' }}
                  placeholder='e.g. 1'
                  value={xr}
                  onChange={setXr}
                  changeOnWheel
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>Tolerance</label>
                <InputNumber
                  rootClassName='tw-input-number'
                  style={{ width: '100%' }}
                  placeholder='e.g. 0.0001'
                  value={tolerance}
                  onChange={setTolerance}
                  step={0.0001}
                  changeOnWheel
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>Equation f(x)</label>
                <Input
                  style={{ width: '100%' }}
                  placeholder='e.g. 54x-15'
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                />
              </div>
            </div>

            <div className='mt-6 flex justify-center'>
              <button
                type='button'                
                onClick={handleCalculate}
                className='bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow cursor-pointer'
              >
                Calculate
              </button>
            </div>
            <div>
              
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Bisection