import { useState } from 'react'
import { create, all } from 'mathjs';
const math = create(all, {});
import NavbarMain from '../../components/Navbar'
import { InputNumber, Input, Alert } from 'antd'
import SecantJS from '../../numerical/root_of_equation/Secant.js'
import DataTable from '../../components/DataTable.jsx'
import PlotSecant from '../../components/GraphSecant.jsx'

const Secant = () => {

  const [x0, setx0] = useState(1)
  const [x1, setx1] = useState(2)
  const [tolerance, setTolerance] = useState(1e-6)
  const [equation, setEquation] = useState("x ^ 2 - 7")
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleSubmit = () => {
    try {
      const secant = new SecantJS(x0, x1, equation, tolerance)
      const res = secant.calculate()
      setResult(res)
    } catch (error) {
      setErrorMsg(error.message)
    }
  }

  let functionX = [];

  if (result && result.history && result.history.length > 0) {
    const xs = result.history.map(it => it.x0);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const padding = Math.max(1, Math.min(3, 5 / (Math.abs(x0) + 1)));
    const step = 0.05;
    functionX = Array.from(
      { length: Math.ceil(((maxX - minX) + 2 * padding) / step) + 1 },
      (_, i) => (minX - padding) + i * step
    );
  } else {
    const baseRange = 10 / (Math.log10(Math.abs(x0) + 2) + 1);
    const range = Math.max(2, Math.min(baseRange, 10));
    const step = 0.05;
    functionX = Array.from(
      { length: Math.ceil((2 * range) / step) },
      (_, i) => (x0 - range) + i * step
    )
  }

  let functionY = [];
  try {
    const node = math.parse(equation);
    const compiled = node.compile();
    functionY = functionX.map(x => compiled.evaluate({ x }));
  } catch (err) {
    functionY = functionX.map(_ => null);
  }

  const secantColumns = [
    { id: 'iteration', label: 'Iteration' },
    { id: 'x1', label: 'Xk', align: 'right', format: v => Number(v).toPrecision(8) },
    { id: 'fx1', label: 'Yk', align: 'right', format: v => Number(v).toPrecision(6) },
    { id: 'errorPercent', label: 'Error%', align: 'right', format: v => (v == null ? '-' : v.toFixed(7) + '%') },
  ]
  const tableRows = result?.history ?? []

  return (
    <div className='text-white'>
      <NavbarMain />
      <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-8 text-center'><span className='text-gradient'>Secant</span> Method</h1>
          <div className='mx-auto max-w-5xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
            {errorMsg && (
              <div className='mb-4'>
                <Alert type='error' message={errorMsg} showIcon />
              </div>
            )}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>X Start (x0)</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 1' value={x0} onChange={setx0} changeOnWheel />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>X End (x1)</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 2' value={x1} onChange={setx1} changeOnWheel />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>Tolerance</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 1e-6' value={tolerance} onChange={setTolerance} changeOnWheel />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>Equation</label>
                <Input rootClassName='tw-input' placeholder='e.g. x^2 - 7' value={equation} onChange={setEquation} />
              </div>
            </div>

            <div className='mt-6 flex justify-center'>
              <button type='button' onClick={handleSubmit} className='bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow cursor-pointer'>
                Calculate
              </button>
            </div>
            {result && (<div className='mt-6 text-sm text-blue-200'> <p className='text-xl'> Root : <span className='font-semibold text-white text-[19px]'>{result.root.toFixed(10)}</span> </p> <p className='text-xl'> Iterations: <span className='font-semibold text-white text-[19px]'>{result.iterations}</span> </p> </div>)}
          </div>
        </div>

        { /* Graph Section */ }
        <div className='mx-auto mt-10 max-w-6xl rounded-xl border border-blue-700/40 
                bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm min-h-[400px]'>
          <h2 className='text-2xl font-semibold mb-4'>Graph</h2>
          <PlotSecant
            dataX={functionX}
            dataY={functionY}
            graphName='Secant Method Convergence'
            resultX={result?.x0}
            resultY={result?.x1}
            secantData={result?.history || []}
          />
        </div>


        { /* Table Section */ }
        <div className='mx-auto mt-10 max-w-6xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
          <h2 className='text-2xl font-semibold mb-4'>Table</h2>
          <DataTable
            columns={secantColumns}
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

export default Secant