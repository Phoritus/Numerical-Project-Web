import React from 'react';
import NavbarMain from './Navbar';
import { InputNumber } from 'antd';
import { BiReset } from 'react-icons/bi';
import Spinner from './Spinner';
import { useExample } from '../hooks/useExample';
import { parseMatrix, buildEmptyMatrix, buildEmptyVector, disabledMatrix } from '../../public/MatrixExperi';

class MatrixComponentClass extends React.Component {
  state = {
    matrixSize: 3,
    matrixA: Array(3).fill(null).map(() => Array(3).fill(null)),
    vectorB: Array(3).fill(null),
    solution: null,
    formVersion: 0,
    isCalculating: false
  };

  handleMatrixSizeChange = (value) => {
    const newSize = value || 3;
    this.setState(prev => ({
      matrixSize: newSize,
      matrixA: Array(newSize).fill(null).map((_, i) =>
        Array(newSize).fill(null).map((_, j) => prev.matrixA[i]?.[j] ?? null)
      ),
      vectorB: Array(newSize).fill(null).map((_, i) => prev.vectorB[i] ?? null)
    }));
  };

  updateCell = (type, i, j, value) => {
    this.setState(prev => ({
      [type]: type === 'matrixA'
        ? prev.matrixA.map((row, r) => r === i ? row.map((c, cIdx) => cIdx === j ? (value ?? null) : c) : row)
        : prev.vectorB.map((v, idx) => idx === i ? (value ?? null) : v)
    }));
  };

  handleReset = () => {
    this.setState(prev => ({
      matrixA: buildEmptyMatrix(prev.matrixSize),
      vectorB: buildEmptyVector(prev.matrixSize),
      solution: null,
      formVersion: prev.formVersion + 1
    }));
  };

  handleExample = () => {
    // This will be passed from wrapper component
    if (this.props.onExample) {
      this.props.onExample();
    }
  };

  handleCalculate = () => {
    this.setState({ isCalculating: true, solution: null }, () => {
      try {
        const { matrixA, vectorB } = this.state;
        const parsedA = parseMatrix(matrixA, 'matrix A');
        const parsedB = parseMatrix(vectorB, 'vector B').flat();
        const solver = new this.props.solverClass(parsedA, parsedB);
        this.setState({ solution: solver.calculate(), isCalculating: false });
      } catch (e) {
        alert(e.message);
        this.setState({ isCalculating: false });
      }
    });
  };

  renderMatrixInputs = (label, data, isMatrix) => {
    const { matrixSize, formVersion } = this.state;
    return (
      <div className='flex flex-col items-center'>
        <div className='text-lg font-semibold mb-2'>{label}</div>
        <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(${isMatrix ? matrixSize : 1}, minmax(50px, 1fr))` }}>
          {isMatrix
            ? data.map((row, i) => row.map((value, j) => (
                <input
                  key={`${label}${formVersion}-${i}-${j}`}
                  className='matrix-input'
                  value={value ?? ''}
                  onChange={(e) => this.updateCell('matrixA', i, j, e.target.value)}
                  placeholder={`a${i + 1}${j + 1}`}
                  style={{ width: 80, height: 80 }}
                />
              )))
            : data.map((value, i) => (
                <input
                  key={`${label}${formVersion}-${i}`}
                  className='matrix-input'
                  value={value ?? ''}
                  onChange={(e) => this.updateCell('vectorB', i, null, e.target.value)}
                  placeholder={`b${i + 1}`}
                  style={{ width: 80, height: 80 }}
                />
              ))}
        </div>
      </div>
      );
  };

  render() {
    const { matrixSize, matrixA, vectorB, solution, isCalculating } = this.state;
    const { LatexResultComponent, title = 'Matrix solver' } = this.props;
    
    return (
      <div className='text-white'>
        <NavbarMain />
        <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
          <div className='container mx-auto'>
            <h1 className='text-4xl font-bold mb-6'><span className='text-gradient'>{title}</span></h1>
            <div className='matrix-panel'>
              <label className='matrix-label'>Matrix Size (n x n)</label>
              <div className='matrix-actions'>
                <InputNumber rootClassName='tw-input-number' min={2} max={50} placeholder='e.g. 3' value={matrixSize} onChange={this.handleMatrixSizeChange} changeOnWheel />
                <button onClick={this.handleReset} className='btnError'>
                  <BiReset size={20} />
                </button>
                <button onClick={this.handleCalculate} disabled={isCalculating} className={`btnCalculate ${!isCalculating ? 'hover:bg-blue-500' : ''}`}>
                  {isCalculating ? 'Calculating…' : 'Calculate'}
                </button>

                <button onClick={this.handleExample} className='btnExample'>
                  Example
                </button>
              </div>
            </div>
            <div className='flex flex-wrap gap-8 items-center justify-center mt-10'>
              {this.renderMatrixInputs('[A]', matrixA, true)}
              <div className='flex flex-col items-center'>
                <div className='text-lg font-semibold mb-2'>{'{x}'}</div>
                <div className='grid gap-3'>
                  {disabledMatrix(matrixSize)}
                </div>
              </div>
              <div className='text-3xl font-semibold mt-8'> = </div>
              {this.renderMatrixInputs('{B}', vectorB, false)}
            </div>
            <div className='matrix-result-panel'>
              <h2 className='text-2xl font-semibold mb-10'>Result</h2>
              {isCalculating && <div className='flex justify-center items-center h-40'><Spinner /></div>}
              {!isCalculating && solution && <LatexResultComponent solution={solution} />}
              {!isCalculating && !solution && <div className='text-center text-blue-200/70 py-10'>Please input values and click Calculate</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Wrapper component to use hooks with class component
const MatrixComponent = (props) => {
  const { exampleApiFunction } = props;
  const matrixRef = React.useRef();

  const { handleExample } = exampleApiFunction 
    ? useExample(exampleApiFunction, {
        setErrorMsg: (msg) => msg && alert(msg),
        ref: matrixRef,
        fields: { matrixSize: null, matrixA: null, vectorB: null }
      })
    : { handleExample: () => {} };

  return <MatrixComponentClass {...props} ref={matrixRef} onExample={handleExample} />;
};

export default MatrixComponent;