import React, { useRef, useState } from 'react'
import NavbarMain from '../../components/Navbar'
import { InputNumber, Input, Alert } from 'antd'
import BisectionJS from '../../numerical/root_of_equation/Bisection.js';
import DataTable from '../../components/DataTable.jsx';
import FunctionRootPlot from '../../components/FunctionRootPlot.jsx';

const Bisection = () => {
  const [xl, setXl] = useState()
  const [xr, setXr] = useState()
  const [tolerance, setTolerance] = useState()
  const [equation, setEquation] = useState()
  const lastParamsRef = useRef(null)
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleCalculate = () => {

    const params = {
      xl: xl == null ? null : Number(xl),
      xr: xr == null ? null : Number(xr),
      tolerance: tolerance == null ? null : Number(tolerance),
      equation: equation.trim(),
    }

    lastParamsRef.current = params
    setErrorMsg(null)
    setResult(null)

    // Basic validations
    if (params.xl == null || params.xr == null || params.tolerance == null || !params.equation) {
      setErrorMsg('Fill in all fields');
      return;
    }
    if (params.xl >= params.xr) {
      setErrorMsg('xl must be less than xr');
      return;
    }
    if (params.tolerance <= 0) {
      setErrorMsg('Tolerance must be greater than 0');
      return;
    }

    try {
      const solver = new BisectionJS(params.equation, params.xl, params.xr, params.tolerance);
      const r = solver.calculate();
      setResult(r);
      console.log(r);
    } catch (error) {
      setErrorMsg(error.message);
    }

  }

  const bisectionColumns = [
    { id: 'iteration', label: 'Iteration' },
    { id: 'xm', label: 'Xm', align: 'right', format: v => Number(v).toPrecision(8) },
    { id: 'fxm', label: 'Ym', align: 'right', format: v => Number(v).toPrecision(6) },
    { id: 'errorPercent', label: 'Error%', align: 'right', format: v => (v == null ? '-' : v.toFixed(7) + '%') },
  ]

  const tableRows = result?.history ?? [];

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
                  placeholder='e.g. 100'
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
                  placeholder='e.g. 0.00001'
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
                  placeholder='e.g. x^12 - 1265256'
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
            {errorMsg && (
              <div className='mt-4'>
                <Alert type='error' showIcon message={errorMsg} />
              </div>
            )}
            {result && (
              <div className='mt-6 text-sm text-blue-200'>
                <p className='text-xl'>Root : <span className='font-semibold text-white text-[19px]'>{result.root.toFixed(10)}</span></p>
                <p className='text-xl'>Iterations: <span className='font-semibold text-white text-[19px]'>{result.iterations}</span></p>
                <p className='text-xl'>Converged: <span className='font-semibold text-white text-[19px]'>{result.converged ? 'Yes✅' : 'No❌'}</span></p>
              </div>
            )}

          </div>

          {tableRows.length > 0 && (
            <div className='mx-auto mt-10 max-w-4xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
              <h2 className='text-2xl font-semibold mb-4'>Table</h2>
              <DataTable
                columns={bisectionColumns}
                rows={tableRows}
                getRowId={r => r.iteration}
                dense
                striped
                maxHeight={600}
                // Custom styling to mimic provided layout (smaller italic headers etc.)
                sx={{
                  '& thead th': {
                    fontSize: 12,
                    fontStyle: 'italic',
                    color: '#94a3b8',
                    background: 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.12)'
                  },
                  '& tbody td': {
                    fontSize: 13,
                    paddingTop: 0.75,
                    paddingBottom: 0.75,
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                  },
                  '& tbody tr:hover': {
                    background: 'rgba(255,255,255,0.04)'
                  },
                }}
              />
            </div>
          )}

          {/* Future: Graph and comparison with Newton */}
          {result && (
            <div className='mx-auto mt-10 max-w-4xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
              <h2 className='text-2xl font-semibold mb-4'>Graph</h2>
              <FunctionRootPlot
                functionExpr={equation}
                history={result.history}
                method='bisection'
                showIterations
                showBrackets
                height={420}
                onPointClick={(p) => console.log('Clicked point', p)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bisection