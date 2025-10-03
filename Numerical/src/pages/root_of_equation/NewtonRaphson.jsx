import { useState } from "react"
import NavbarMain from '../../components/Navbar'
import { InputNumber, Input, Alert } from "antd"
import NewtonRaphsonJS from '../../numerical/root_of_equation/NewtonRaphson.js'
import DataTable from '../../components/DataTable.jsx'
import PlotTangent from "../../components/GraphTangent.jsx"
import { create, all } from 'mathjs';
const math = create(all, {});

const NewtonRaphson = () => {

  const [x0, setx0] = useState(1)
  const [tolerance, setTolerance] = useState(1e-6)
  const [equation, setEquation] = useState("x ^ 2 - 7")
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleCalculate = () => {
    const params = {
      x0: x0 == null ? null : Number(x0),
      tolerance: tolerance == null ? null : Number(tolerance),
      equation: equation == null ? null : String(equation),
    }
    setErrorMsg(null)
    setResult(null)

    if (params.x0 == null || params.tolerance == null || !params.equation) { setErrorMsg("Fill in all fields"); return }
    if (params.tolerance <= 0) { setErrorMsg("Tolerance must be greater than 0"); return }
    try {
      const solver = new NewtonRaphsonJS(params.x0, params.equation, params.tolerance)
      const r = solver.calculate()
      if (r.error && r.message) { setErrorMsg(r.message || "Calculation error"); return }
      setResult(r)
    } catch (error) {
      setErrorMsg("Error calculating root")
    }
  }

  let functionX = [];

  if (result && result.history && result.history.length > 0) {
    const xs = result.history.map(it => it.xCurrent);
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
    );
  }

  // parse equation safely
  let functionY = [];
  try {
    const node = math.parse(equation);
    const compiled = node.compile();
    functionY = functionX.map(x => compiled.evaluate({ x }));
  } catch {
    functionY = functionX.map(() => null);
  }

  const newTonRaphsonColumns = [
    { id: 'iteration', label: 'Iteration' },
    { id: 'xCurrent', label: 'Xk', align: 'right', format: v => Number(v).toPrecision(8) },
    { id: 'fxCurrent', label: 'Yk', align: 'right', format: v => Number(v).toPrecision(6) },
    { id: 'errorPercent', label: 'Error%', align: 'right', format: v => (v == null ? '-' : v.toFixed(7) + '%') },
  ]

  const tableRows = result?.history ?? []


  return (
    <div className='text-white'>
      <NavbarMain />
      <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold'> <span className='text-gradient'>Newton Raphson</span> Method</h1>

          {/* Input Panel */}
          <div className='mx-auto max-w-4xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
            {errorMsg && (
              <div className='mb-4'>
                <Alert type='error' message={errorMsg} showIcon />
              </div>
            )}

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3'>
              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>X Start (x0)</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 0' value={x0} onChange={setx0} changeOnWheel />
              </div>

              <div className='flex flex-col gap-1'>
                <label className='text-sm text-blue-200'>Tolerance</label>
                <InputNumber rootClassName='tw-input-number' style={{ width: '100%' }} placeholder='e.g. 0.000001' value={tolerance} onChange={setTolerance} changeOnWheel />
              </div>

              <div className='flex flex-col gap-1 sm:col-span-3 lg:col-span-1'>
                <label className='text-sm text-blue-200'>Equation</label>
                <Input rootClassName='tw-input' style={{ width: '100%' }} placeholder='e.g. (7+x)/(x+1)' value={equation} onChange={e => setEquation(e.target.value)} />
              </div>

            </div>

            <div className='mt-6 flex justify-center'>
              <button type='button' onClick={handleCalculate} className='bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow cursor-pointer'>
                Calculate
              </button>
            </div>

            {result && (<div className='mt-6 text-sm text-blue-200'> <p className='text-xl'> Root : <span className='font-semibold text-white text-[19px]'>{result.x1.toFixed(10)}</span> </p> <p className='text-xl'> Iterations: <span className='font-semibold text-white text-[19px]'>{result.iteration}</span> </p> </div>)}
          </div>

        </div>

        {/* Graph Section */}
        <div className='mx-auto mt-10 max-w-6xl rounded-xl border border-blue-700/40 
                bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm min-h-[400px]'>
          <h2 className='text-2xl font-semibold mb-4'>Graph</h2>
          <PlotTangent
            dataX={functionX}
            dataY={functionY}
            graphName='Newton Raphson Method Convergence'
            resultX={result?.x1}
            resultY={result?.fx1}
            tangentLineData={result}
          />
        </div>

        {/* Table Section */}
        <div className="mx-auto mt-10 max-w-6xl rounded-xl border border-blue-700/40 
                bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Table</h2>
          <DataTable
            columns={newTonRaphsonColumns}
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

export default NewtonRaphson