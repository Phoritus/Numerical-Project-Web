import MatrixHaveInit from "../../components/matrixHaveInit";
import ConjugateSolver from '../../numerical/linear_algebra/Conjugate.js';
import ConjugateLatexResult from '../../components/latex_result/linear_algebra/ConjugateLatexResult.jsx';
import { conjugateGradientExample } from '../../numerical/examples/linearAlgebra_api.js';
import { useExample } from '../../hooks/useExample.js';
import { useRef } from 'react';

const Conjugate = () => {
  const matrixRef = useRef(null);
  const { handleExample, loading: exampleLoading } = useExample(conjugateGradientExample, {
    ref: matrixRef,
    fields: {
      matrixSize: true,
      matrixA: true,
      vectorB: true,
      initialGuess: true,
    },
  });

  return (
    <MatrixHaveInit
      ref={matrixRef}
      title="Conjugate Gradient Method"
      solverClass={ConjugateSolver}
      LatexResultComponent={ConjugateLatexResult}
      onExample={handleExample}
      exampleLoading={exampleLoading}
    />
  )
}

export default Conjugate;