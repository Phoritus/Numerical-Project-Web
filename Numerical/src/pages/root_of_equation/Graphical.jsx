import { useState } from 'react'
import NavbarMain from '../../components/Navbar'
import { InputNumber, Input, Alert } from 'antd'
import GraphicalJS from '../../numerical/root_of_equation/Graphical.js'
import DataTable from '../../components/DataTable.jsx'
import PlotWithTailwind from '../../components/Graph.jsx'

export const Graphical = () => {
  const [xl, setXl] = useState()
  const [xr, setXr] = useState()
  const [equation, setEquation] = useState('')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleCalculate = () => {
    const params = {
      xl: xl == null ? null : Number(xl),
      xr: xr == null ? null : Number(xr),
      equation: (equation || '').trim(),
    }
    setErrorMsg(null)
    setResult(null)
    if (params.xl == null || params.xr == null || !params.equation) { setErrorMsg('Fill in all fields'); return }
    if (params.xl >= params.xr) { setErrorMsg('xl must be less than xr'); return }
    try {
      const solver = new GraphicalJS(params.xl, params.xr, params.equation)
      const r = solver.calculate()
      setResult(r)
    } catch (err) { setErrorMsg(err.message) }
  }

  const graphicalColumns = [
    { id: 'iteration', label: 'Iteration' },
    { id: 'xm', label: 'Xk', align: 'right', format: v => Number(v).toPrecision(8) },
    { id: 'fxm', label: 'Yk', align: 'right', format: v => Number(v).toPrecision(6) },
    { id: 'errorPercent', label: 'Error%', align: 'right', format: v => (v == null ? '-' : v.toFixed(7) + '%') },
  ]
  const tableRows = result?.history ?? []

  return (
    <div className='text-white'>
      <NavbarMain />
      <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-8 text-center'><span className='text-gradient'>Graphical</span> Method</h1>

          {/* Input Panel */}
          <div className='mx-auto max-w-4xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3'>
              {errorMsg && (
                <div className='sm:col-span-3 order-first'>
                  <Alert type='error' message={errorMsg} showIcon className='w-full' style={{ width: '100%' }} />
                </div>
              )}
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>X Start (xL)</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 0' value={xl} onChange={setXl} changeOnWheel />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>X End (xR)</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 20' value={xr} onChange={setXr} changeOnWheel />
              </div>

              <div className='flex flex-col gap-1 sm:col-span-3 lg:col-span-1'>
                <label className='text-sm text-blue-200'>Equation</label>
                <Input rootClassName='tw-input' style={{ width: '100%' }} placeholder='e.g. x ^ 12 - 1265256' value={equation} onChange={(e) => setEquation(e.target.value)} />
              </div>
            </div>

            <div className='mt-6 flex justify-center'>
              <button type='button' onClick={handleCalculate} className='bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow cursor-pointer'>
                Calculate
              </button>
            </div>

            {result && (<div className='mt-6 text-sm text-blue-200'> <p className='text-xl'> Root : <span className='font-semibold text-white text-[19px]'>{result.root.toFixed(10)}</span> </p> <p className='text-xl'> Iterations: <span className='font-semibold text-white text-[19px]'>{result.iterations}</span> </p> </div>)}
          </div>
        </div>

        {/* Graph Section */}
        <div className='mx-auto mt-10 max-w-6xl rounded-xl border border-blue-700/40 
                bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm min-h-[400px]'>
          <h2 className='text-2xl font-semibold mb-4'>Graph</h2>
          <PlotWithTailwind
            dataX={result?.history.map(p => p.xm)}
            dataY={result?.history.map(p => p.fxm)}
            graphName='Graphical Method Convergence'
          />
        </div>

        {/* Table Section */}
        <div className='mx-auto mt-10 max-w-6xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
          <h2 className='text-2xl font-semibold mb-4'>Table</h2>
          <DataTable
            columns={graphicalColumns}
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

export default Graphical;