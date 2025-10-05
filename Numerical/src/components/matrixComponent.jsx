import React from 'react';
import NavbarMain from './Navbar';
import { InputNumber } from 'antd';
import { BiReset } from 'react-icons/bi';
import Spinner from './Spinner';

class MatrixComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matrixSize: 3,
      matrixA: this.buildEmptyMatrix(3),
      vectorB: this.buildEmptyVector(3),
      solution: null,
      formVersion: 0,
      isCalculating: false
    };
  }

  buildEmptyMatrix = (n) => Array.from({ length: n }, () => Array.from({ length: n }, () => null));
  buildEmptyVector = (n) => Array.from({ length: n }, () => null);

  handleMatrixSizeChange = (value) => {
    const newSize = value || 3;
    this.setState(prev => ({
      matrixSize: newSize,
      matrixA: Array.from({ length: newSize }, (_, i) =>
        Array.from({ length: newSize }, (_, j) => (prev.matrixA[i] && prev.matrixA[i][j] != null ? prev.matrixA[i][j] : null))
      ),
      vectorB: Array.from({ length: newSize }, (_, i) => (prev.vectorB[i] != null ? prev.vectorB[i] : null))
    }));
  };

  updateMatrixA = (i, j, value) => {
    this.setState(prev => ({
      matrixA: prev.matrixA.map((row, r) => r === i ? row.map((c, cIdx) => cIdx === j ? (value ?? null) : c) : row)
    }));
  };

  updateVectorB = (i, value) => {
    this.setState(prev => ({
      vectorB: prev.vectorB.map((v, idx) => idx === i ? (value ?? null) : v)
    }));
  };

  handleReset = () => {
    this.setState(prev => ({
      matrixA: this.buildEmptyMatrix(prev.matrixSize),
      vectorB: this.buildEmptyVector(prev.matrixSize),
      solution: null,
      formVersion: prev.formVersion + 1
    }));
  };

  handleCalculate = () => {
    this.setState({ isCalculating: true, solution: null }, () => {
      try {
        const { matrixA, vectorB } = this.state;
        const { solverClass } = this.props;
        const parsedA = matrixA.map(row => row.map(val => {
          const num = parseFloat(val);
          if (isNaN(num)) throw new Error('All entries in matrix A must be valid numbers.');
          return num;
        }));
        const parsedB = vectorB.map(val => {
          const num = parseFloat(val);
          if (isNaN(num)) throw new Error('All entries in vector B must be valid numbers.');
          return num;
        });
        const solver = new solverClass(parsedA, parsedB);
        const result = solver.calculate();
        this.setState({ solution: result, isCalculating: false });
      } catch (e) {
        alert(e.message);
        this.setState({ isCalculating: false });
      }
    });
  };

  render() {
    const { matrixSize, matrixA, vectorB, solution, formVersion, isCalculating } = this.state;
    const { LatexResultComponent, title='Matrix solver' } = this.props; // allow override  
    return (
      <div className='text-white'>
        <NavbarMain />
        <div className='min-h-screen bg-gradient-to-b from-blue-900 to-black py-[90px]'>
          <div className='container mx-auto'>
            <h1 className='text-4xl font-bold mb-6'><span className='text-gradient'>{title}</span></h1>
            <div className='mx-auto max-w-xs rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm text-blue-200'>Matrix Size (n x n)</label>
                  <div className='flex items-center gap-3'>
                    <InputNumber
                      rootClassName='tw-input-number'
                      min={2}
                      max={50}
                      placeholder='e.g. 3'
                      value={matrixSize}
                      onChange={this.handleMatrixSizeChange}
                      changeOnWheel
                    />
                    <button onClick={this.handleReset} className='tw-button !bg-red-600 hover:!bg-red-700 px-3 py-2 text-xl rounded-lg cursor-pointer transition-colors'>
                      <BiReset size={20} />
                    </button>
                    <button
                      type='button'
                      onClick={this.handleCalculate}
                      disabled={isCalculating}
                      className={`bg-blue-600 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${!isCalculating ? 'hover:bg-blue-500' : ''}`}
                    >
                      {isCalculating ? 'Calculating…' : 'Calculate'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-wrap gap-8 items-center justify-center mt-10'>
              <div className='flex flex-col items-center'>
                <div className='text-lg font-semibold mb-2'>[A]</div>
                <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(50px, 1fr))` }}>
                  {matrixA.map((row, i) => (
                    row.map((value, j) => (
                      <input
                        key={`a${formVersion}-${i}-${j}`}
                        className='w-full px-3 py-3 bg-blue-950/30 border border-blue-700/30 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50'
                        value={value ?? ''}
                        onChange={(e) => this.updateMatrixA(i, j, e.target.value)}
                        placeholder={`a${i + 1}${j + 1}`}
                        style={{ width: 80, height: 80 }}
                      />
                    ))
                  ))}
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <div className='text-lg font-semibold mb-2'>{'{x}'}</div>
                <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(1, minmax(50px, 1fr))` }}>
                  {Array.from({ length: matrixSize }, (_, i) => (
                    <div key={`x${i}`} className='relative'>
                      <input
                        className='w-full px-3 py-3 bg-blue-950/10 border border-blue-700/10 rounded-lg text-center placeholder-gray-600 cursor-not-allowed focus:outline-none'
                        placeholder={`x${i + 1}`}
                        disabled
                        style={{ width: 80, height: 80 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className='text-3xl font-semibold mt-8'> = </div>
              </div>
              <div className='flex flex-col items-center'>
                <div className='text-lg font-semibold mb-2'>{'{B}'}</div>
                <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(1, minmax(50px, 1fr))` }}>
                  {vectorB.map((value, i) => (
                    <input
                      key={`b${formVersion}-${i}`}
                      className='w-full px-3 py-3 bg-blue-950/30 border border-blue-700/30 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50'
                      value={value ?? ''}
                      onChange={(e) => this.updateVectorB(i, e.target.value)}
                      placeholder={`b${i + 1}`}
                      style={{ width: 80, height: 80 }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className='mx-auto mt-10 max-w-4xl rounded-xl border border-blue-700/40 bg-blue-900/30 p-6 shadow-lg backdrop-blur-sm'>
              <h2 className='text-2xl font-semibold mb-10'>Result</h2>
              {isCalculating && (
                <div className='flex justify-center items-center h-40'><Spinner /></div>
              )}
              {!isCalculating && solution && <LatexResultComponent solution={solution} />}
              {!isCalculating && !solution && (
                <div className='text-center text-blue-200/70 py-10'>Please input values and click Calculate</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatrixComponent;