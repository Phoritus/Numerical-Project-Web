import { useState } from 'react'
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
            dataX={result?.history.map(p => p.x0) || []}
            dataY={result?.history.map(p => p.x1) || []}
            graphName='Secant Method Convergence'
            resultX={result?.x0}
            resultY={result?.x1}
            secantData={result?.history || []}
          />
        </div>
      </div>
    </div>
  )
}

export default Secant