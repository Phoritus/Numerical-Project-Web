import { useState } from 'react'
import NavbarMain from '../../components/Navbar'
import { InputNumber, Input, Alert } from 'antd'
import BisectionJS from '../../numerical/root_of_equation/Bisection.js'
import DataTable from '../../components/DataTable.jsx'
import PlotWithTailwind from '../../components/Graph.jsx'
import { useExample } from '../../hooks/useExample.js'
import { bisectionExample } from '../../numerical/examples/rootFinding.js'
import LoadingClock from '../../components/LoadingClock.jsx'

const Bisection = () => {
  const [xl, setXl] = useState()
  const [xr, setXr] = useState()
  const [tolerance, setTolerance] = useState()
  const [equation, setEquation] = useState('')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleCalculate = () => {
    const params = {
      xl: xl == null ? null : Number(xl),
      xr: xr == null ? null : Number(xr),
      tolerance: tolerance == null ? null : Number(tolerance),
      equation: (equation || '').trim(),
    }
    setErrorMsg(null)
    setResult(null)
    if (params.xl == null || params.xr == null || params.tolerance == null || !params.equation) { setErrorMsg('Fill in all fields'); return }
    if (params.xl >= params.xr) { setErrorMsg('xl must be less than xr'); return }
    if (params.tolerance <= 0) { setErrorMsg('Tolerance must be greater than 0'); return }
    try {
      const solver = new BisectionJS(params.equation, params.xl, params.xr, params.tolerance)
      const r = solver.calculate()
      setResult(r)
    } catch (err) { setErrorMsg(err.message) }
  }

  const { handleExample, loading: exampleLoading } = useExample(bisectionExample, {
    setErrorMsg,
    fields: {
      xl: setXl,
      xr: setXr,
      tolerance: setTolerance,
      equation: setEquation
    }
  })

  const bisectionColumns = [
    { id: 'iteration', label: 'Iteration' },
    { id: 'xm', label: 'Xm', align: 'right', format: v => Number(v).toPrecision(8) },
    { id: 'fxm', label: 'Ym', align: 'right', format: v => Number(v).toPrecision(6) },
    { id: 'errorPercent', label: 'Error%', align: 'right', format: v => (v == null ? '-' : v.toFixed(7) + '%') },
  ]
  const tableRows = result?.history ?? []
  return (
    <div className='text-white'>
      <NavbarMain />
      <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-8 text-center'><span className='text-gradient'>Bisection</span> Method</h1>

          {/* Input Panel */}
          <div className='mx-auto max-w-5xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
            {errorMsg && (
              <div className='mb-4'>
                <Alert type='error' message={errorMsg} showIcon />
              </div>
            )}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>X Start (xL)</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 0' value={xl} onChange={setXl} changeOnWheel />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>X End (xR)</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 100' value={xr} onChange={setXr} changeOnWheel />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>Tolerance</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 0.00001' value={tolerance} onChange={setTolerance} step={0.0001} changeOnWheel />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>Equation f(x)</label>
                <Input style={{ width: '100%' }} placeholder='e.g. x^12 - 1265256' value={equation} onChange={(e) => setEquation(e.target.value)} />
              </div>
            </div>
            <div className='mt-6 flex justify-center gap-5'>
              <button type='button' onClick={handleCalculate} className='bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow cursor-pointer'>
                Calculate
              </button>

              <button className={`ml-4 ${exampleLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 cursor-pointer'} text-white font-semibold px-6 py-2 rounded-md transition-colors shadow flex items-center gap-2`} type='button' onClick={handleExample} disabled={exampleLoading}>
                {exampleLoading ? <><LoadingClock size={20} /> Loading...</> : 'Example'}
              </button>
            </div>

            {result && (<div className='mt-6 text-sm text-blue-200'> <p className='text-xl'> Root : <span className='font-semibold text-white text-[19px]'>{result.root.toFixed(10)}</span> </p> <p className='text-xl'> Iterations: <span className='font-semibold text-white text-[19px]'>{result.iterations}</span> </p></div>)}
          </div>


        </div>


        {/* Graph Section */}
        <div className='mx-auto mt-10 max-w-6xl rounded-xl border border-blue-700/40 
                bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm min-h-[400px]'>
          <h2 className='text-2xl font-semibold mb-4'>Graph</h2>
          <PlotWithTailwind
            dataX={result?.history.map(p => p.xm)}
            dataY={result?.history.map(p => p.fxm)}
            graphName='Bisection Method Convergence'
          />
        </div>


        {/* Table Section */}
        <div className='mx-auto mt-10 max-w-6xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
          <h2 className='text-2xl font-semibold mb-4'>Table</h2>
          <DataTable
            columns={bisectionColumns}
            rows={tableRows}
            getRowId={r => r.iteration}
            dense
            striped
            maxHeight={750}
            sx={{
              '& thead th': { fontSize: 12, fontStyle: 'italic', color: '#94a3b8', background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.12)' },
              '& tbody td': { fontSize: 13, paddingTop: 0.75, paddingBottom: 0.75, borderBottom: '1px solid rgba(255,255,255,0.05)' },
              '& tbody tr:hover': { background: 'rgba(255,255,255,0.04)' },
              '& .MuiTable-root': { minWidth: 1000 }
            }}
          />
        </div>
      </div>
    </div>
  )
}
export default Bisection