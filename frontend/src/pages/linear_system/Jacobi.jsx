import { useRef } from 'react';
import JacobiSolver from '../../numerical/linear_algebra/Jacobi.js';
import { jacobiExample } from '../../numerical/examples/linearAlgebra_api.js';
import JacobiLatexResult from '../../components/latex_result/linear_algebra/JacobiLatexResult.jsx';
import MatrixComponent from '../../components/matrixHaveInit.jsx';
import { useExample } from '../../hooks/useExample.js';

const Jacobi = () => {
  // Ref to access class component instance so the hook can set its internal state
  const matrixRef = useRef(null);

  // Configure example loader to populate fields on the class component
  const { handleExample, loading: exampleLoading } = useExample(jacobiExample, {
    ref: matrixRef,
    // Keys indicate which fields from API to set on the class component
    fields: {
      matrixSize: true,
      matrixA: true,
      vectorB: true,
      initialGuess: true,
    },
  });

  return (
    <MatrixComponent
      ref={matrixRef}
      title="Jacobi Iteration Method"
      solverClass={JacobiSolver}
      LatexResultComponent={JacobiLatexResult}
      onExample={handleExample}
      exampleLoading={exampleLoading}
    />
  );
};

export default Jacobi;