import React from 'react'
import NavbarMain from './Navbar'
import { InputNumber } from 'antd'
import { BiReset } from 'react-icons/bi'
import Spinner from './Spinner'
import LoadingClock from './LoadingClock.jsx'
import { parseMatrix, buildEmptyMatrix, buildEmptyVector, disabledMatrix, renderMatrixHorizontal } from '../../public/MatrixExperi'

export default class MatrixHaveInit extends React.Component {
  state = {
    matrixSize: 3,
    matrixA: Array(3).fill(null).map(() => Array(3).fill(null)),
    vectorB: Array(3).fill(null),
    initialGuess: Array(3).fill(null),
    solution: null,
    formVersion: 0,
    isCalculating: false
  }

  handleMatrixSizeChange = (value) => {
    const newSize = value || 3;
    this.setState(prev => ({
      matrixSize: newSize,
      matrixA: Array(newSize).fill(null).map((_, i) =>
        Array(newSize).fill(null).map((_, j) => prev.matrixA[i]?.[j] ?? null)),
      vectorB: Array(newSize).fill(null).map((_, i) => prev.vectorB[i] ?? null),
      initialGuess: Array(newSize).fill(null).map((_, i) => prev.initialGuess[i] ?? null)
    }))
  }

  updateCell = (type, i, j, value) => {
    this.setState(prev => ({
      [type]: type === 'matrixA'
        ? prev.matrixA.map((row, r) => r === i ? row.map((c, cIdx) => cIdx === j ? (value ?? null) : c) : row)
        : prev.vectorB.map((v, idx) => idx === i ? (value ?? null) : v),
      // For initialGuess, use column index j when present (horizontal row vector)
      initialGuess: type === 'initialGuess'
        ? prev.initialGuess.map((v, idx) => (idx === (j ?? i) ? (value ?? null) : v))
        : prev.initialGuess
    }))
  }

  handleReset = () => {
    this.setState(prev => ({
      matrixA: buildEmptyMatrix(prev.matrixSize),
      vectorB: buildEmptyVector(prev.matrixSize),
      initialGuess: buildEmptyVector(prev.matrixSize),
      solution: null,
      formVersion: prev.formVersion + 1
    }))
  }

  handleExample = () => {
    if (this.props.onExample) {
      this.props.onExample()
    }
  }

  handleCalculate = () => {
    this.setState({ isCalculating: true, solution: null }, () => {
      try {
        const { matrixA, vectorB, initialGuess } = this.state;
        const paresedA = parseMatrix(matrixA, 'matrix A');
        const paresedB = parseMatrix(vectorB, 'vector B').flat();
        const paresedInit = parseMatrix(initialGuess, 'initial guess').flat();
        const solver = new this.props.solverClass(paresedA, paresedB, paresedInit, 1e-6, 100);
        this.setState({ solution: solver.calculate(), isCalculating: false });
      } catch (error) {
        alert(error.message);
        this.setState({ isCalculating: false });
      }
    });
  }

  renderMatrixInput = (label, matrix, isMatrix) => {
    const { matrixSize, formVersion } = this.state;
    return (
      <div className='flex flex-col items-center'>
        <h3 className='text-white mb-2'>{label}</h3>
        <div className='grid gap-2' style={{ gridTemplateColumns: `repeat(${isMatrix ? matrixSize : 1}, minmax(0, 1fr))` }}>
          {isMatrix
            ? matrix.map((row, i) => row.map((val, j) => (
              <input
                key={`${label}${formVersion}-${i}-${j}`}
                className='matrix-input'
                value={val ?? ''}
                onChange={(e) => this.updateCell('matrixA', i, j, e.target.value)}
                placeholder={`a${i + 1}${j + 1}`}
                style={{ width: 80, height: 80 }}
              />
            )))
            : matrix.map((val, i) => (
              <input
                key={`${label}${formVersion}-${i}`}
                className='matrix-input'
                value={val ?? ''}
                onChange={(e) => this.updateCell('vectorB', i, null, e.target.value)}
                placeholder={`b${i + 1}`}
                style={{ width: 80, height: 80 }}
              />
            ))}
        </div>
      </div>
    )
  }

  render() {
    const { matrixSize, matrixA, vectorB, initialGuess, solution, isCalculating } = this.state;
    const { LatexResultComponent, title } = this.props;
    return (
      <div className="text-white">
        <NavbarMain />
  <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
          <div className='container mx-auto'>
            <h1 className='text-4xl font-bold mb-6'><span className='text-gradient'>{title}</span></h1>
            <div className='matrix-panel'>
              <label className='matrix-label'>Matrix Size (n x n)</label>
              <div className='matrix-actions'>
                <InputNumber rootClassName='tw-input-number' min={2} max={50} placeholder='e.g. 3' value={matrixSize} onChange={this.handleMatrixSizeChange} changeOnWheel />
                <button className='btnReset' onClick={this.handleReset}><BiReset /></button>
                <button onClick={this.handleCalculate} disabled={isCalculating} className='btnCalculate'>
                  {isCalculating ? 'Calculating…' : 'Calculate'}
                </button>
                {this.props.onExample && (
                  <button onClick={this.handleExample} disabled={this.props.exampleLoading} className={`btnExample flex items-center gap-2 ${this.props.exampleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {this.props.exampleLoading ? <><LoadingClock size={20} /> Loading...</> : 'Example'}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className='flex flex-wrap gap-8 items-center justify-center mt-10'>
            {this.renderMatrixInput('[A]', matrixA, true)}
            <div className='flex flex-col items-center'>
              <div className='text-lg font-semibold mb-2'>{'{x}'}</div>
              <div className='grid gap-3'>
                {disabledMatrix(matrixSize)}
              </div>
            </div>
            <div className='text-3xl font-semibold mt-8'> = </div>
            {this.renderMatrixInput('{B}', vectorB, false)}
          </div>
          {/* Place initial guess below, since Xi is not part of Ax = B */}
          <div className='mt-8 flex justify-center'>
            {renderMatrixHorizontal('{Xi}', initialGuess, this.state.formVersion, this.updateCell)}
          </div>
          <div className='matrix-result-panel'>
            <h2 className='text-2xl font-semibold mb-10'>Result</h2>
            {isCalculating && <div className='flex justify-center items-center h-40'><Spinner /></div>}
            {!isCalculating && solution && <LatexResultComponent solution={solution} />}
            {!isCalculating && !solution && <div className='text-center text-blue-200/70 py-10'>Please input values and click Calculate</div>}
          </div>
        </div>
      </div>
    )
  }
}