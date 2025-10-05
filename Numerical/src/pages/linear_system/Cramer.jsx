import { useState } from 'react'
import NavbarMain from '../../components/Navbar'
import { InputNumber } from 'antd'
import { BiReset } from "react-icons/bi"
import Spinner from '../../components/Spinner.jsx'
import CramerLatexResult from '../../components/CramerLatexResult.jsx'
import CramerJS from '../../numerical/linear_algebra/Cramer.js'

const Cramer = () => {

  const buildEmptyMatrix = (n) => Array.from({ length: n }, () => Array.from({ length: n }, () => null))
  const buildEmptyVector = (n) => Array.from({ length: n }, () => null)

  const [matrixSize, setMatrixSize] = useState(3)
  const [matrixA, setMatrixA] = useState(() => buildEmptyMatrix(3))
  const [vectorB, setVectorB] = useState(() => buildEmptyVector(3))
  const [solution, setSolution] = useState(null)
  const [formVersion, setFormVersion] = useState(0)

  const handleMatrixSizeChange = (value) => {
    const newSize = value || 3
    setMatrixSize(newSize)
    setMatrixA(prev => Array.from({ length: newSize }, (_, i) =>
      Array.from({ length: newSize }, (_, j) => (prev[i] && prev[i][j] != null ? prev[i][j] : null))
    ))
    setVectorB(prev => Array.from({ length: newSize }, (_, i) => (prev[i] != null ? prev[i] : null)))
  }

  const updateMatrixA = (i, j, value) => {
    setMatrixA(prev => prev.map((row, r) => r === i ? row.map((c, cIdx) => cIdx === j ? (value ?? null) : c) : row))
  }

  const updateVectorB = (i, value) => {
    setVectorB(prev => prev.map((v, idx) => idx === i ? (value ?? null) : v))
  }

  const handleReset = () => {
    // If you also want size back to default uncomment next line:
    // setMatrixSize(3)
    const size = matrixSize // keep current size
    setMatrixA(buildEmptyMatrix(size))
    setVectorB(buildEmptyVector(size))
    setSolution(null)
    // bump version to force all input elements to re-mount (guarantees clearing even if value stays same)
    setFormVersion(v => v + 1)
  }

  const handleCalculate = () => {
    try {
      const parsedA = matrixA.map(row => row.map(val => {
        const num = parseFloat(val);
        if (isNaN(num)) throw new Error("All entries in matrix A must be valid numbers.");
        return num;
      }));

      const parsedB = vectorB.map(val => {
        const num = parseFloat(val);
        if (isNaN(num)) throw new Error("All entries in vector B must be valid numbers.");
        return num;
      });

      const cramer = new CramerJS(parsedA, parsedB);
      const result = cramer.calculate();
      setSolution(result);
      console.log("Cramer's Rule Result:", result);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='text-white'>
      <NavbarMain />
      <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
        <div className='container mx-auto'>
          <h1 className='text-4xl font-bold mb-6'><span className='text-gradient'>Cramer's Rule</span></h1>

          <div className='mx-auto max-w-xs rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
            <div className='flex flex-col gap-4'>

              {/* Matrix Size Input and Buttons */}
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-blue-200'>Matrix Size (n x n)</label>

                <div className='flex items-center gap-3'>
                  <InputNumber
                    rootClassName='tw-input-number'
                    min={2}
                    max={6}
                    placeholder='e.g. 3'
                    value={matrixSize}
                    onChange={handleMatrixSizeChange}
                    changeOnWheel
                  />
                  <button onClick={handleReset} className='tw-button !bg-red-600 hover:!bg-red-700 px-3 py-2 text-xl rounded-lg cursor-pointer transition-colors'>
                    <BiReset size={20} />
                  </button>
                  <button type='button' onClick={handleCalculate} className='bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow cursor-pointer'>
                    Calculate
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className='flex flex-wrap gap-8 items-center justify-center mt-10'>
            {/* Matrix A */}
            <div className='flex flex-col items-center'>
              <div className='text-lg font-semibold mb-2'>[A]</div>
              <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(50px, 1fr))` }}>
                {matrixA.map((row, i) => (
                  row.map((value, j) => (
                    <input
                      key={`a${formVersion}-${i}-${j}`}
                      className='w-full px-3 py-3 bg-blue-950/30 border border-blue-700/30 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50'
                      value={value ?? ''}
                      onChange={(e) => updateMatrixA(i, j, e.target.value)}
                      placeholder={`a${i + 1}${j + 1}`}
                      style={{ width: 80, height: 80 }}
                    />
                  ))
                ))}
              </div>
            </div>

            {/* Vector x */}
            <div className='flex flex-col items-center'>
              <div className='text-lg font-semibold mb-2'>{'{x}'}</div>
              <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(1, minmax(50px, 1fr))` }}>
                {Array.from({ length: matrixSize }, (_, i) => (
                  <div key={`x${i}`} className='relative'>
                    <input
                      className='w-full px-3 py-3 bg-blue-950/10 border border-blue-700/10 rounded-lg text-center placeholder-gray-600 cursor-not-allowed focus:outline-none'
                      placeholder={`x${i + 1}`}
                      readOnly
                      style={{ width: 80, height: 80 }}
                    />
                  </div>

                ))}
              </div>
            </div>

            <div>
              <div className='text-3xl font-semibold mt-8'> = </div>
            </div>

            {/* Vector B */}
            <div className='flex flex-col items-center'>
              <div className='text-lg font-semibold mb-2'>{'{B}'}</div>
              <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(1, minmax(50px, 1fr))` }}>
                {vectorB.map((value, i) => (
                  <input
                    key={`b${formVersion}-${i}`}
                    className='w-full px-3 py-3 bg-blue-950/30 border border-blue-700/30 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50'
                    value={value ?? ''}
                    onChange={(e) => updateVectorB(i, e.target.value)}
                    placeholder={`b${i + 1}`}
                    style={{ width: 80, height: 80 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className='mx-auto mt-10 max-w-4xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
            <h2 className='text-2xl font-semibold mb-4'>Result</h2>
            {!solution && <div className='flex justify-center items-center h-40'><Spinner /></div>}
            {solution && <CramerLatexResult solution={solution} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cramer